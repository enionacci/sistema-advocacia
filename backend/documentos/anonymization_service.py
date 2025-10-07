"""
Serviço de Anonimização Reversível de Documentos
Baseado no anonimyze.py original com Hugging Face
"""

import os
import re
from typing import Dict, List, Tuple, Optional
from django.utils import timezone
from django.conf import settings
from huggingface_hub import InferenceClient
from .models import DocumentoAnonimizacao, AnonimizacaoItem


class AnonymizationService:
    """
    Serviço para anonimização e reversão de dados pessoais em documentos
    """
    
    # Contadores para placeholders únicos
    _counters = {
        'nome': 0,
        'cpf': 0,
        'rg': 0,
        'endereco': 0,
        'telefone': 0,
        'email': 0,
        'outro': 0
    }
    
    def __init__(self):
        """
        Inicializa o serviço de anonimização com Hugging Face
        """
        self.hf_token = os.getenv("HF_TOKEN")
        self.model_id = "gpt-oss/120b-cloud"
        
        print(f"🔍 DEBUG - Inicializando AnonymizationService")
        print(f"🔍 DEBUG - HF_TOKEN presente: {'Sim' if self.hf_token else 'Não'}")
        print(f"🔍 DEBUG - HF_TOKEN (primeiros 10 chars): {self.hf_token[:10] if self.hf_token else 'N/A'}...")
        print(f"🔍 DEBUG - Model ID: {self.model_id}")
        
        if self.hf_token:
            try:
                self.client = InferenceClient(model=self.model_id, token=self.hf_token)
                print(f"✅ DEBUG - Cliente Hugging Face inicializado com sucesso")
            except Exception as e:
                self.client = None
                print(f"❌ DEBUG - Erro ao inicializar cliente Hugging Face: {str(e)}")
        else:
            self.client = None
            print("⚠️ Token do Hugging Face não encontrado. Funcionalidade de IA desabilitada.")
    
    @classmethod
    def reset_counters(cls):
        """Reset contadores para nova anonimização"""
        for key in cls._counters:
            cls._counters[key] = 0
    
    @classmethod
    def get_next_placeholder(cls, tipo_dado: str) -> str:
        """
        Gera próximo placeholder único para o tipo de dado
        
        Args:
            tipo_dado: Tipo do dado (nome, cpf, rg, etc.)
            
        Returns:
            Placeholder único (ex: NOME1, CPF2, etc.)
        """
        cls._counters[tipo_dado] += 1
        return f"{tipo_dado.upper()}{cls._counters[tipo_dado]}"
    
    def detect_and_anonymize_regex(self, texto: str) -> Tuple[str, List[Dict]]:
        """
        Detecta e anonimiza dados usando regex (método rápido)
        
        Args:
            texto: Texto a ser anonimizado
            
        Returns:
            Tuple com (texto_anonimizado, lista_substituicoes)
        """
        print(f"🔍 DEBUG REGEX - Iniciando anonimização por regex")
        print(f"🔍 DEBUG REGEX - Texto original (primeiros 200 chars): {texto[:200]}")
        
        substituicoes = []
        texto_anonimizado = texto
        
        # Padrões regex para diferentes tipos de dados
        patterns = {
            'cpf': r'\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b',
            'rg': r'\b\d{1,2}\.?\d{3}\.?\d{3}-?[0-9xX]\b',
            'telefone': r'\b(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}\b',
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            # Endereços mais complexos - padrão básico
            'endereco': r'\b(?:Rua|Av|Avenida|Travessa|Alameda|Praça)\s+[^,\n]{5,50}(?:,\s*\d+)?'
        }
        
        # Processar cada tipo de dado
        for tipo_dado, pattern in patterns.items():
            matches = list(re.finditer(pattern, texto_anonimizado, re.IGNORECASE))
            print(f"🔍 DEBUG REGEX - Tipo '{tipo_dado}': encontrados {len(matches)} matches")
            
            # Processar matches de trás para frente para manter posições
            for match in reversed(matches):
                valor_original = match.group()
                placeholder = self.get_next_placeholder(tipo_dado)
                
                print(f"🔍 DEBUG REGEX - Match: '{valor_original}' -> '{placeholder}'")
                
                # Substituir no texto
                texto_anonimizado = (
                    texto_anonimizado[:match.start()] + 
                    placeholder + 
                    texto_anonimizado[match.end():]
                )
                
                # Registrar substituição
                substituicoes.append({
                    'tipo_dado': tipo_dado,
                    'valor_original': valor_original,
                    'valor_anonimizado': placeholder,
                    'posicao_inicio': match.start(),
                    'posicao_fim': match.end(),
                    'contexto': self._get_context(texto, match.start(), match.end())
                })
        
        print(f"🔍 DEBUG REGEX - Total de substituições: {len(substituicoes)}")
        print(f"🔍 DEBUG REGEX - Texto anonimizado (primeiros 200 chars): {texto_anonimizado[:200]}")
        
        return texto_anonimizado, substituicoes
    
    def detect_and_anonymize_ai(self, texto: str, config: Dict) -> Tuple[str, List[Dict]]:
        """
        Detecta e anonimiza dados usando IA do Hugging Face (método principal)
        
        Args:
            texto: Texto a ser anonimizado
            config: Configurações de anonimização
            
        Returns:
            Tuple com (texto_anonimizado, lista_substituicoes)
        """
        if not self.client:
            print("⚠️ Cliente Hugging Face não disponível, usando regex como fallback")
            return self.detect_and_anonymize_regex(texto)
        
        # Monta prompt baseado nas configurações
        tipos_para_anonimizar = []
        if config.get('anonimizar_nomes', True):
            tipos_para_anonimizar.append('Nomes de pessoas')
        if config.get('anonimizar_cpf', True):
            tipos_para_anonimizar.append('CPFs')
        if config.get('anonimizar_rg', True):
            tipos_para_anonimizar.append('RGs')
        if config.get('anonimizar_enderecos', True):
            tipos_para_anonimizar.append('Endereços completos')
        if config.get('anonimizar_telefones', True):
            tipos_para_anonimizar.append('Telefones')
        if config.get('anonimizar_emails', True):
            tipos_para_anonimizar.append('E-mails')
        
        prompt = f"""Você é um assistente especializado em anonimização de textos para compliance LGPD.

TAREFA: Anonimize o seguinte texto substituindo os dados pessoais por placeholders conforme especificado.

TIPOS DE DADOS PARA ANONIMIZAR:
{', '.join(tipos_para_anonimizar)}

REGRAS DE SUBSTITUIÇÃO:
- Nomes de pessoas: NOME1, NOME2, NOME3...
- CPFs: CPF1, CPF2, CPF3...
- RGs: RG1, RG2, RG3...
- Endereços: ENDERECO1, ENDERECO2, ENDERECO3...
- Telefones: TELEFONE1, TELEFONE2, TELEFONE3...
- E-mails: EMAIL1, EMAIL2, EMAIL3...

FORMATO DE RESPOSTA:
1. Primeiro apresente o TEXTO ANONIMIZADO completo
2. Depois apresente as SUBSTITUIÇÕES no formato:
   TIPO|VALOR_ORIGINAL|PLACEHOLDER

TEXTO ORIGINAL:
{texto}

RESPOSTA:"""
        
        try:
            print(f"🤖 Enviando texto para anonimização via Hugging Face ({self.model_id})")
            
            response = self.client.text_generation(
                prompt,
                max_new_tokens=2048,
                temperature=0.3,  # Mais determinístico para anonimização
                top_k=50,
                do_sample=True,
            )
            
            print(f"✅ Resposta recebida do Hugging Face")
            return self._parse_ai_response(response)
            
        except Exception as e:
            print(f"❌ Erro na anonimização com Hugging Face: {str(e)}")
            print("🔄 Usando regex como fallback")
            return self.detect_and_anonymize_regex(texto)
    
    def _parse_ai_response(self, resposta: str) -> Tuple[str, List[Dict]]:
        """
        Processa resposta da IA para extrair texto anonimizado e substituições
        
        Args:
            resposta: Resposta da IA
            
        Returns:
            Tuple com (texto_anonimizado, lista_substituicoes)
        """
        print(f"🔍 DEBUG - Resposta da IA completa:\n{resposta}\n")
        print(f"🔍 DEBUG - Tamanho da resposta: {len(resposta)} caracteres")
        
        lines = resposta.strip().split('\n')
        texto_anonimizado = ""
        substituicoes = []
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            
            # Detectar seções
            if 'TEXTO ANONIMIZADO' in line.upper() or line.startswith('1.'):
                current_section = 'texto'
                print(f"🔍 DEBUG - Detectada seção de TEXTO")
                continue
            elif 'SUBSTITUIÇÕES' in line.upper() or 'SUBSTITUICOES' in line.upper() or line.startswith('2.'):
                current_section = 'substituicoes'
                print(f"🔍 DEBUG - Detectada seção de SUBSTITUIÇÕES")
                continue
            
            if current_section == 'texto' and line:
                # Evitar linhas de cabeçalho
                if not ('SUBSTITUIÇÕES' in line.upper() or 'SUBSTITUICOES' in line.upper() or line.startswith('2.')):
                    texto_anonimizado += line + ' '
            elif current_section == 'substituicoes' and line and '|' in line:
                print(f"🔍 DEBUG - Processando linha de substituição: {line}")
                parts = line.split('|')
                if len(parts) >= 3:
                    tipo_map = {
                        'NOME': 'nome',
                        'CPF': 'cpf',
                        'RG': 'rg',
                        'ENDERECO': 'endereco',
                        'TELEFONE': 'telefone',
                        'EMAIL': 'email'
                    }
                    
                    tipo_original = parts[0].strip().upper()
                    tipo_dado = tipo_map.get(tipo_original, 'outro')
                    valor_original = parts[1].strip()
                    valor_anonimizado = parts[2].strip()
                    
                    print(f"🔍 DEBUG - Substituição: {tipo_dado} | {valor_original} -> {valor_anonimizado}")
                    
                    substituicoes.append({
                        'tipo_dado': tipo_dado,
                        'valor_original': valor_original,
                        'valor_anonimizado': valor_anonimizado,
                        'posicao_inicio': None,
                        'posicao_fim': None,
                        'contexto': ''
                    })
        
        # Limpar o texto anonimizado
        texto_anonimizado = texto_anonimizado.strip()
        
        # Se não conseguiu extrair o texto, tentar extrair de forma mais simples
        if not texto_anonimizado:
            # Pegar tudo até a primeira menção de substituições
            resposta_parts = resposta.split('SUBSTITUIÇÕES')[0].split('SUBSTITUICOES')[0]
            texto_anonimizado = resposta_parts.strip()
        
        print(f"📊 Extraídas {len(substituicoes)} substituições")
        return texto_anonimizado, substituicoes
    
    def _get_context(self, texto: str, inicio: int, fim: int, tamanho_contexto: int = 50) -> str:
        """
        Extrai contexto ao redor de uma posição no texto
        
        Args:
            texto: Texto completo
            inicio: Posição inicial
            fim: Posição final
            tamanho_contexto: Tamanho do contexto em caracteres
            
        Returns:
            Contexto ao redor da posição
        """
        start_context = max(0, inicio - tamanho_contexto)
        end_context = min(len(texto), fim + tamanho_contexto)
        
        contexto = texto[start_context:end_context]
        return contexto.replace('\n', ' ').strip()
    
    def anonymize_document(
        self, 
        anonimizacao: DocumentoAnonimizacao, 
        use_ai: bool = True
    ) -> bool:
        """
        Processa anonimização de um documento
        
        Args:
            anonimizacao: Instância de DocumentoAnonimizacao
            use_ai: Se True, usa IA; se False, usa apenas regex
            
        Returns:
            True se sucesso, False caso contrário
        """
        try:
            print(f"🔒 Iniciando anonimização com {'IA Hugging Face' if use_ai else 'Regex'}")
            print(f"🔍 DEBUG - use_ai={use_ai}, self.client={self.client is not None}")
            
            # Marca como processando
            anonimizacao.status = 'processando'
            anonimizacao.save()
            
            # Reset contadores
            self.reset_counters()
            
            # Configurações da anonimização
            config = {
                'anonimizar_nomes': anonimizacao.anonimizar_nomes,
                'anonimizar_cpf': anonimizacao.anonimizar_cpf,
                'anonimizar_rg': anonimizacao.anonimizar_rg,
                'anonimizar_enderecos': anonimizacao.anonimizar_enderecos,
                'anonimizar_telefones': anonimizacao.anonimizar_telefones,
                'anonimizar_emails': anonimizacao.anonimizar_emails,
            }
            
            print(f"🔍 DEBUG - Configuração: {config}")
            
            # Processa baseado no método escolhido
            if use_ai and self.client:
                print(f"✅ DEBUG - Usando IA Hugging Face")
                texto_anonimizado, substituicoes = self.detect_and_anonymize_ai(
                    anonimizacao.texto_original, 
                    config
                )
            else:
                print(f"⚠️ DEBUG - Usando Regex (use_ai={use_ai}, client={self.client is not None})")
                texto_anonimizado, substituicoes = self.detect_and_anonymize_regex(
                    anonimizacao.texto_original
                )
            
            # Salva resultado
            anonimizacao.texto_anonimizado = texto_anonimizado
            anonimizacao.status = 'concluido'
            anonimizacao.data_conclusao = timezone.now()
            anonimizacao.save()
            
            print(f"🔍 DEBUG - Total de substituições para salvar: {len(substituicoes)}")
            
            # Salva substituições individuais
            for idx, sub in enumerate(substituicoes, 1):
                print(f"🔍 DEBUG - Salvando substituição {idx}/{len(substituicoes)}: {sub}")
                item = AnonimizacaoItem.objects.create(
                    anonimizacao=anonimizacao,
                    tipo_dado=sub['tipo_dado'],
                    valor_original=sub['valor_original'],
                    valor_anonimizado=sub['valor_anonimizado'],
                    posicao_inicio=sub.get('posicao_inicio'),
                    posicao_fim=sub.get('posicao_fim'),
                    contexto=sub.get('contexto', '')
                )
                print(f"✅ DEBUG - Item {idx} salvo com ID: {item.id}")
            
            # Verificar quantos itens foram realmente salvos
            total_itens_salvos = AnonimizacaoItem.objects.filter(anonimizacao=anonimizacao).count()
            print(f"📊 DEBUG - Total de itens salvos no banco: {total_itens_salvos}")
            
            # Atualiza texto do documento
            documento = anonimizacao.documento
            documento.texto_extraido = texto_anonimizado
            documento.save()
            
            print(f"✅ Anonimização concluída: {len(substituicoes)} substituições")
            return True
            
        except Exception as e:
            print(f"❌ Erro na anonimização: {str(e)}")
            anonimizacao.status = 'erro'
            anonimizacao.mensagem_erro = str(e)
            anonimizacao.save()
            return False
    
    def reverse_anonymization(self, anonimizacao: DocumentoAnonimizacao) -> bool:
        """
        Reverte anonimização de um documento
        
        Args:
            anonimizacao: Instância de DocumentoAnonimizacao
            
        Returns:
            True se sucesso, False caso contrário
        """
        try:
            if anonimizacao.status != 'concluido':
                raise Exception("Anonimização deve estar concluída para ser revertida")
            
            print(f"🔄 Revertendo anonimização do documento {anonimizacao.documento.id}")
            
            # Restaura texto original
            documento = anonimizacao.documento
            documento.texto_extraido = anonimizacao.texto_original
            documento.save()
            
            # Marca como revertido
            anonimizacao.status = 'revertido'
            anonimizacao.data_reversao = timezone.now()
            anonimizacao.save()
            
            print(f"✅ Anonimização revertida com sucesso")
            return True
            
        except Exception as e:
            print(f"❌ Erro na reversão: {str(e)}")
            anonimizacao.mensagem_erro = f"Erro na reversão: {str(e)}"
            anonimizacao.save()
            return False