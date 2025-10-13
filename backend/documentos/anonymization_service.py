"""
services/anonymization_working.py - VERSÃO QUE FUNCIONA DE VERDADE
"""

import re
import logging
import threading
from typing import Dict, List, Tuple
from django.utils import timezone
from .models import DocumentoAnonimizacao, AnonimizacaoItem

logger = logging.getLogger(__name__)

class WorkingAnonymizationService:
    """Serviço que REALMENTE anonimiza todos os dados sensíveis."""
    
    _counters = {}
    _counter_lock = threading.Lock()

    @classmethod
    def reset_counters(cls):
        with cls._counter_lock:
            cls._counters = {}

    @classmethod
    def get_next_placeholder(cls, tipo: str) -> str:
        with cls._counter_lock:
            count = cls._counters.get(tipo, 0) + 1
            cls._counters[tipo] = count
            return f"[{tipo}_{count}]"

    def validate_cpf(self, cpf: str) -> bool:
        """Validação de CPF - aceita formatos com erro."""
        try:
            cpf_clean = re.sub(r'[^\d]', '', cpf)
            if len(cpf_clean) != 11:
                return False
            
            # Se todos os dígitos são iguais, é inválido
            if cpf_clean == cpf_clean[0] * 11:
                return False
                
            # Para CPFs com formato incorreto mas que parecem CPF, aceitar
            return True
        except:
            return False

    def validate_cnpj(self, cnpj: str) -> bool:
        """Validação relaxada de CNPJ."""
        try:
            cnpj_clean = re.sub(r'[^\d]', '', cnpj)
            return len(cnpj_clean) == 14
        except:
            return False

    def anonymize_document(self, anonimizacao: DocumentoAnonimizacao) -> bool:
        """ANONIMIZAÇÃO REAL - pega TODOS os dados sensíveis."""
        try:
            logger.info(f"🎯 Anonimização REAL - Doc {anonimizacao.id}")
            
            if not anonimizacao.texto_original or not anonimizacao.texto_original.strip():
                anonimizacao.status = 'erro'
                anonimizacao.mensagem_erro = "Texto original está vazio"
                anonimizacao.save()
                return False

            anonimizacao.status = 'processando'
            anonimizacao.save()

            self.reset_counters()
            texto_anonimizado = anonimizacao.texto_original
            total_substituicoes = 0

            # =====================================
            # 1. PROCESSOS CNJ - TODOS OS FORMATOS
            # =====================================
            processo_patterns = [
                r'\b(\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})\b',  # Formato padrão
                r'processo\s+n?[º°]?\.?\s*(\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})',
                r'autos\s+de\s+n?[º°]?\.?\s*(\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})',
                r'informe\s+o\s+processo\s+(\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})'
            ]
            
            for pattern in processo_patterns:
                matches = list(re.finditer(pattern, texto_anonimizado, re.IGNORECASE))
                for match in reversed(matches):
                    if len(match.groups()) >= 1:
                        processo = match.group(1)
                        placeholder = self.get_next_placeholder("PROCESSO")
                        
                        AnonimizacaoItem.objects.create(
                            anonimizacao=anonimizacao,
                            tipo_dado='processo',
                            valor_original=processo,
                            valor_anonimizado=placeholder,
                            contexto=self._get_context(texto_anonimizado, match.start(), match.end())
                        )
                        
                        # Substituir o processo mantendo o contexto
                        texto_anonimizado = (
                            texto_anonimizado[:match.start(1)] + 
                            placeholder + 
                            texto_anonimizado[match.end(1):]
                        )
                        total_substituicoes += 1
                        logger.info(f"✅ Processo: {processo} → {placeholder}")

            # =====================================
            # 2. CPF - TODOS OS FORMATOS E CONTEXTOS
            # =====================================
            cpf_patterns = [
                r'CPF\s*n?[º°]?\.?\s*(\d{3}\.?\d{3}\.?\d{3}-?\d{1,2})\b',  # CPF com label
                r'\b(\d{3}\.\d{3}\.\d{3}-\d{1,2})\b',  # CPF isolado
                r'([A-ZÀ-ÚÇ][a-zà-ÿç\s]+),\s*CPF\s*n?[º°]?\.?\s*(\d{3}\.?\d{3}\.?\d{3}-?\d{1,2})',  # Nome + CPF
            ]
            
            for pattern in cpf_patterns:
                matches = list(re.finditer(pattern, texto_anonimizado, re.IGNORECASE))
                for match in reversed(matches):
                    # Encontrar qual grupo tem o CPF
                    cpf = None
                    cpf_group = 1
                    
                    for i in range(1, len(match.groups()) + 1):
                        grupo = match.group(i)
                        if grupo and re.search(r'\d{3}\.?\d{3}\.?\d{3}-?\d', grupo):
                            cpf = grupo
                            cpf_group = i
                            break
                    
                    if cpf and self.validate_cpf(cpf):
                        placeholder = self.get_next_placeholder("CPF")
                        
                        AnonimizacaoItem.objects.create(
                            anonimizacao=anonimizacao,
                            tipo_dado='cpf',
                            valor_original=cpf,
                            valor_anonimizado=placeholder,
                            contexto=self._get_context(texto_anonimizado, match.start(), match.end())
                        )
                        
                        # Substituir apenas o CPF
                        texto_anonimizado = (
                            texto_anonimizado[:match.start(cpf_group)] + 
                            placeholder + 
                            texto_anonimizado[match.end(cpf_group):]
                        )
                        total_substituicoes += 1
                        logger.info(f"✅ CPF: {cpf} → {placeholder}")

            # =====================================
            # 3. CNPJ - TODOS OS FORMATOS
            # =====================================
            cnpj_patterns = [
                r'CNPJ\s*n?[º°]?\.?\s*(\d{1,2}\.?\d{3}\.?\d{3}/?0001-?\d{2})\b',
                r'\b(\d{1,2}\.\d{3}\.\d{3}/0001-\d{2})\b',
                r'detentora\s+do\s+CNPJ\s*n?[º°]?\.?\s*(\d{1,2}\.?\d{3}\.?\d{3}/?0001-?\d{2})'
            ]
            
            for pattern in cnpj_patterns:
                matches = list(re.finditer(pattern, texto_anonimizado, re.IGNORECASE))
                for match in reversed(matches):
                    cnpj = match.group(1)
                    if self.validate_cnpj(cnpj):
                        placeholder = self.get_next_placeholder("CNPJ")
                        
                        AnonimizacaoItem.objects.create(
                            anonimizacao=anonimizacao,
                            tipo_dado='cnpj',
                            valor_original=cnpj,
                            valor_anonimizado=placeholder,
                            contexto=self._get_context(texto_anonimizado, match.start(), match.end())
                        )
                        
                        texto_anonimizado = (
                            texto_anonimizado[:match.start(1)] + 
                            placeholder + 
                            texto_anonimizado[match.end(1):]
                        )
                        total_substituicoes += 1
                        logger.info(f"✅ CNPJ: {cnpj} → {placeholder}")

            # =====================================
            # 4. NOMES DE PESSOAS - TODOS OS CONTEXTOS
            # =====================================
            if anonimizacao.anonimizar_nomes:
                nome_patterns = [
                    # Nome em qualificação 
                    r'\b([A-ZÀ-ÚÇ][A-ZÀ-ÚÇ\s]{10,60}),\s*já\s+devidamente\s+qualificad[oa]',
                    # Nome de sócio
                    r'sócio\s+no\s+polo\s+passivo[^,]*,\s*([A-ZÀ-ÚÇ][a-zà-ÿç\s]+[A-ZÀ-ÚÇ][a-zà-ÿç]+),\s*CPF',
                    r'sócio[^,]*,\s*([A-ZÀ-ÚÇ][a-zà-ÿç\s]+[A-ZÀ-ÚÇ][a-zà-ÿç]+),\s*CPF',
                    r'inclusão\s+do\s+sócio[^,]*,\s*([A-ZÀ-ÚÇ][a-zà-ÿç\s]+[A-ZÀ-ÚÇ][a-zà-ÿç]+),\s*CPF',
                    # Nome do advogado 
                    r'assinado\s+digitalmente\s+(?:por\s+)?([A-ZÀ-ÚÇ][A-ZÀ-ÚÇ\s]{10,50})\s+(?:OAB|e\s+Tribunal)',
                    r'-\s*([A-ZÀ-ÚÇ][A-ZÀ-ÚÇ\s]{10,50})\s*-',  # Nome entre traços
                    # Nomes gerais
                    r'\b([A-ZÀ-ÚÇ][A-ZÀ-ÚÇ\s]{15,60})\b(?=\s*(?:OAB|CPF|,\s*já|,\s*residente))',
                ]
                
                for pattern in nome_patterns:
                    matches = list(re.finditer(pattern, texto_anonimizado, re.IGNORECASE))
                    for match in reversed(matches):
                        nome = match.group(1).strip()
                        
                        if self._is_valid_person_name(nome):
                            placeholder = self.get_next_placeholder("NOME")
                            
                            AnonimizacaoItem.objects.create(
                                anonimizacao=anonimizacao,
                                tipo_dado='nome_pessoa',
                                valor_original=nome,
                                valor_anonimizado=placeholder,
                                contexto=self._get_context(texto_anonimizado, match.start(), match.end())
                            )
                            
                            texto_anonimizado = (
                                texto_anonimizado[:match.start(1)] + 
                                placeholder + 
                                texto_anonimizado[match.end(1):]
                            )
                            total_substituicoes += 1
                            logger.info(f"✅ Nome: {nome} → {placeholder}")

            # =====================================
            # 5. EMPRESAS - TODAS AS VARIAÇÕES
            # =====================================
            empresa_patterns = [
                r'\bA\s+Executada\s+([A-ZÀ-ÚÇ][A-Za-zÀ-ÿç\s]{5,50}(?:Eireli|Ltda|Empreendimentos|S\.?A\.?))',
                r'\b([A-ZÀ-ÚÇ][A-Za-zÀ-ÿç\s]{5,50}(?:Eireli|Ltda|Empreendimentos|S\.?A\.?))\b',
                r'detentora\s+do\s+CNPJ[^,]*,?\s*([A-ZÀ-ÚÇ][A-Za-zÀ-ÿç\s]{5,50}(?:Eireli|Ltda|Empreendimentos))'
            ]
            
            for pattern in empresa_patterns:
                matches = list(re.finditer(pattern, texto_anonimizado, re.IGNORECASE))
                for match in reversed(matches):
                    empresa = match.group(1).strip()
                    
                    if self._is_valid_company_name(empresa):
                        placeholder = self.get_next_placeholder("EMPRESA")
                        
                        AnonimizacaoItem.objects.create(
                            anonimizacao=anonimizacao,
                            tipo_dado='empresa',
                            valor_original=empresa,
                            valor_anonimizado=placeholder,
                            contexto=self._get_context(texto_anonimizado, match.start(), match.end())
                        )
                        
                        texto_anonimizado = (
                            texto_anonimizado[:match.start(1)] + 
                            placeholder + 
                            texto_anonimizado[match.end(1):]
                        )
                        total_substituicoes += 1
                        logger.info(f"✅ Empresa: {empresa} → {placeholder}")

            # =====================================
            # 6. ENDEREÇOS COMPLETOS
            # =====================================
            if anonimizacao.anonimizar_enderecos:
                endereco_patterns = [
                    # Endereço completo brasileiro
                    r'residente\s+e\s+domiciliado\s+(?:à|na|no)\s+([A-ZÀ-ÚÇ][^,]+,\s*n?[º°]?\.?\s*\d+[^,]*(?:,[^,]+)*(?:,\s*CEP:?\s*\d{5}-?\d{3})?)',
                    r'\b((?:Alameda|Rua|Avenida|Praça)\s+[A-ZÀ-ÚÇ][A-Za-zÀ-ÿç\s,]+,\s*n?[º°]?\.?\s*\d+[^.]*?(?:CEP:?\s*\d{5}-?\d{3})?)',
                    # CEP isolado
                    r'\bCEP:?\s*(\d{5}-?\d{3})\b'
                ]
                
                for pattern in endereco_patterns:
                    matches = list(re.finditer(pattern, texto_anonimizado, re.IGNORECASE))
                    for match in reversed(matches):
                        endereco = match.group(1).strip()
                        
                        if self._is_valid_address(endereco):
                            placeholder = self.get_next_placeholder("ENDERECO")
                            
                            AnonimizacaoItem.objects.create(
                                anonimizacao=anonimizacao,
                                tipo_dado='endereco',
                                valor_original=endereco,
                                valor_anonimizado=placeholder,
                                contexto=self._get_context(texto_anonimizado, match.start(), match.end())
                            )
                            
                            texto_anonimizado = (
                                texto_anonimizado[:match.start(1)] + 
                                placeholder + 
                                texto_anonimizado[match.end(1):]
                            )
                            total_substituicoes += 1
                            logger.info(f"✅ Endereço: {endereco[:40]}... → {placeholder}")

            # =====================================
            # 7. VALORES MONETÁRIOS
            # =====================================
            valor_patterns = [
                r'R\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})',
                r'importe\s+de\s+R\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})',
                r'pagamento\s+de\s+R\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})'
            ]
            
            for pattern in valor_patterns:
                matches = list(re.finditer(pattern, texto_anonimizado, re.IGNORECASE))
                for match in reversed(matches):
                    valor = match.group(1)
                    try:
                        valor_num = float(valor.replace('.', '').replace(',', '.'))
                        if valor_num >= 1000:
                            placeholder = self.get_next_placeholder("VALOR")
                            
                            AnonimizacaoItem.objects.create(
                                anonimizacao=anonimizacao,
                                tipo_dado='valor_monetario',
                                valor_original=valor,
                                valor_anonimizado=placeholder,
                                contexto=self._get_context(texto_anonimizado, match.start(), match.end())
                            )
                            
                            texto_anonimizado = (
                                texto_anonimizado[:match.start(1)] + 
                                placeholder + 
                                texto_anonimizado[match.end(1):]
                            )
                            total_substituicoes += 1
                            logger.info(f"✅ Valor: R$ {valor} → {placeholder}")
                    except:
                        continue

            # =====================================
            # 8. OAB
            # =====================================
            oab_patterns = [
                r'(OAB/[A-Z]{2}\s*n?[º°]?\.?\s*\d{3,6}(?:\.\d+)?)\b',
                r'\b(OAB\s*/\s*[A-Z]{2}\s+nº\.?\s*\d{3,6})'
            ]
            
            for pattern in oab_patterns:
                matches = list(re.finditer(pattern, texto_anonimizado, re.IGNORECASE))
                for match in reversed(matches):
                    oab_completo = match.group(1)
                    placeholder = self.get_next_placeholder("OAB")
                    
                    AnonimizacaoItem.objects.create(
                        anonimizacao=anonimizacao,
                        tipo_dado='oab',
                        valor_original=oab_completo,
                        valor_anonimizado=placeholder,
                        contexto=self._get_context(texto_anonimizado, match.start(), match.end())
                    )
                    
                    texto_anonimizado = (
                        texto_anonimizado[:match.start()] + 
                        placeholder + 
                        texto_anonimizado[match.end():]
                    )
                    total_substituicoes += 1
                    logger.info(f"✅ OAB: {oab_completo} → {placeholder}")

            # Finalizar
            anonimizacao.texto_anonimizado = texto_anonimizado
            anonimizacao.status = 'concluido'
            anonimizacao.data_conclusao = timezone.now()
            anonimizacao.save()

            logger.info(f"🎉 Anonimização REAL finalizada: {total_substituicoes} substituições")
            return True

        except Exception as e:
            logger.error(f"❌ Erro na anonimização: {e}", exc_info=True)
            anonimizacao.status = 'erro'
            anonimizacao.mensagem_erro = str(e)
            anonimizacao.save()
            return False

    def _get_context(self, text: str, start: int, end: int, size: int = 30) -> str:
        """Extrai contexto."""
        context_start = max(0, start - size)
        context_end = min(len(text), end + size)
        context = text[context_start:context_end].replace('\n', ' ').strip()
        return context[:100]

    def _is_valid_person_name(self, name: str) -> bool:
        """Validação mais permissiva de nomes."""
        name_clean = name.strip().lower()
        
        # Lista de exclusões mais restritiva
        invalid_terms = {
            'tribunal', 'justiça', 'código', 'processo', 'vara', 'comarca'
        }
        
        for term in invalid_terms:
            if term in name_clean:
                return False
        
        # Deve ter pelo menos 2 palavras
        palavras = name_clean.split()
        if len(palavras) < 2:
            return False
            
        # Deve ter pelo menos 10 caracteres
        if len(name_clean) < 10:
            return False
        
        return True

    def _is_valid_company_name(self, company: str) -> bool:
        """Validação de empresa."""
        company_clean = company.strip().lower()
        
        indicators = ['eireli', 'ltda', 'empreendimentos', 's.a', 'limitada']
        if not any(ind in company_clean for ind in indicators):
            return False
        
        return len(company_clean) > 5

    def _is_valid_address(self, address: str) -> bool:
        """Validação de endereço."""
        address_clean = address.strip().lower()
        
        # Deve ter pelo menos 15 caracteres e um número
        if len(address_clean) < 15 or not re.search(r'\d+', address_clean):
            return False
        
        # Deve ter indicadores de endereço
        if not re.search(r'(alameda|rua|avenida|praça)', address_clean):
            return False
        
        return True

    def deanonymize_text(self, texto_anonimizado: str, anonimizacao_id: int) -> Tuple[str, int]:
        """Desanonimização."""
        try:
            anonimizacao = DocumentoAnonimizacao.objects.get(id=anonimizacao_id)
            itens = anonimizacao.itens.all()
            
            texto_resultante = texto_anonimizado
            substituicoes = 0
            
            for item in itens:
                if item.valor_anonimizado in texto_resultante:
                    count = texto_resultante.count(item.valor_anonimizado)
                    texto_resultante = texto_resultante.replace(
                        item.valor_anonimizado, item.valor_original
                    )
                    substituicoes += count
            
            return texto_resultante, substituicoes
            
        except DocumentoAnonimizacao.DoesNotExist:
            raise ValueError(f"Anonimização {anonimizacao_id} não encontrada")

"""
Adição ao anonymization_service.py - Funcionalidade Manual
"""

class ManualAnonymizationService:
    """Serviço para anonimização manual via interface do usuário."""
    
    def __init__(self):
        self.base_service = WorkingAnonymizationService()
    
    def anonymize_selected_text(self, anonimizacao_id: int, texto_selecionado: str, tipo_sugerido: str = None) -> dict:
        """
        Anonimiza texto selecionado manualmente pelo usuário.
        
        Args:
            anonimizacao_id: ID do documento de anonimização
            texto_selecionado: Texto que o usuário selecionou
            tipo_sugerido: Tipo sugerido (nome, cpf, endereco, etc.)
        
        Returns:
            dict com resultado da operação
        """
        try:
            anonimizacao = DocumentoAnonimizacao.objects.get(id=anonimizacao_id)
            
            # Limpar e validar texto selecionado
            texto_limpo = texto_selecionado.strip()
            
            if not texto_limpo or len(texto_limpo) < 2:
                return {
                    'success': False,
                    'error': 'Texto selecionado muito curto (mínimo 2 caracteres)'
                }
            
            if len(texto_limpo) > 200:
                return {
                    'success': False,
                    'error': 'Texto selecionado muito longo (máximo 200 caracteres)'
                }
            
            # Auto-detectar tipo se não fornecido
            if not tipo_sugerido:
                tipo_sugerido = self._detect_data_type(texto_limpo)
            
            # Verificar se já foi anonimizado
            existing_item = AnonimizacaoItem.objects.filter(
                anonimizacao=anonimizacao,
                valor_original=texto_limpo
            ).first()
            
            if existing_item:
                return {
                    'success': False,
                    'error': f'Texto já anonimizado como {existing_item.valor_anonimizado}',
                    'existing_placeholder': existing_item.valor_anonimizado
                }
            
            # Verificar se texto existe no documento
            if texto_limpo not in anonimizacao.texto_anonimizado:
                return {
                    'success': False,
                    'error': 'Texto selecionado não encontrado no documento'
                }
            
            # Gerar placeholder único para anonimização manual
            placeholder = self._get_next_manual_placeholder(anonimizacao_id, tipo_sugerido)
            
            # Encontrar contexto no texto
            contexto = self._find_context_in_text(anonimizacao.texto_anonimizado, texto_limpo)
            
            # Criar registro da substituição manual
            item = AnonimizacaoItem.objects.create(
                anonimizacao=anonimizacao,
                tipo_dado=f'{tipo_sugerido}_manual',
                valor_original=texto_limpo,
                valor_anonimizado=placeholder,
                contexto=contexto,
                anonimizado_manualmente=True  # NOVO CAMPO
            )
            
            # Contar ocorrências antes de substituir
            ocorrencias = anonimizacao.texto_anonimizado.count(texto_limpo)
            
            # Substituir TODAS as ocorrências no texto
            texto_atualizado = anonimizacao.texto_anonimizado.replace(texto_limpo, placeholder)
            
            # Atualizar documento
            anonimizacao.texto_anonimizado = texto_atualizado
            anonimizacao.save()
            
            logger.info(f"✅ Anonimização manual: '{texto_limpo}' → {placeholder} ({ocorrencias} ocorrências)")
            
            return {
                'success': True,
                'placeholder': placeholder,
                'tipo': tipo_sugerido,
                'ocorrencias': ocorrencias,
                'texto_atualizado': texto_atualizado,
                'item_id': item.id,
                'contexto': contexto
            }
            
        except DocumentoAnonimizacao.DoesNotExist:
            return {
                'success': False,
                'error': 'Documento de anonimização não encontrado'
            }
        except Exception as e:
            logger.error(f"❌ Erro na anonimização manual: {e}", exc_info=True)
            return {
                'success': False,
                'error': f'Erro interno: {str(e)}'
            }
    
    def undo_manual_anonymization(self, anonimizacao_id: int, item_id: int) -> dict:
        """Desfaz uma anonimização manual específica."""
        try:
            anonimizacao = DocumentoAnonimizacao.objects.get(id=anonimizacao_id)
            item = AnonimizacaoItem.objects.get(
                id=item_id,
                anonimizacao=anonimizacao,
                anonimizado_manualmente=True
            )
            
            # Contar ocorrências antes de restaurar
            ocorrencias = anonimizacao.texto_anonimizado.count(item.valor_anonimizado)
            
            if ocorrencias == 0:
                return {
                    'success': False,
                    'error': 'Placeholder não encontrado no texto atual'
                }
            
            # Restaurar texto original
            texto_restaurado = anonimizacao.texto_anonimizado.replace(
                item.valor_anonimizado, 
                item.valor_original
            )
            
            # Guardar dados para retorno
            valor_original = item.valor_original
            placeholder = item.valor_anonimizado
            tipo = item.tipo_dado
            
            # Atualizar documento
            anonimizacao.texto_anonimizado = texto_restaurado
            anonimizacao.save()
            
            # Remover item
            item.delete()
            
            logger.info(f"↩️ Desfeita anonimização manual: {placeholder} → '{valor_original}' ({ocorrencias} ocorrências)")
            
            return {
                'success': True,
                'valor_restaurado': valor_original,
                'placeholder_removido': placeholder,
                'tipo': tipo,
                'ocorrencias': ocorrencias,
                'texto_atualizado': texto_restaurado
            }
            
        except DocumentoAnonimizacao.DoesNotExist:
            return {
                'success': False,
                'error': 'Documento de anonimização não encontrado'
            }
        except AnonimizacaoItem.DoesNotExist:
            return {
                'success': False,
                'error': 'Item de anonimização não encontrado'
            }
        except Exception as e:
            logger.error(f"❌ Erro ao desfazer anonimização: {e}", exc_info=True)
            return {
                'success': False,
                'error': f'Erro interno: {str(e)}'
            }
    
    def get_suggestions_for_selection(self, texto_selecionado: str) -> dict:
        """Sugere tipo e validações para texto selecionado."""
        texto_limpo = texto_selecionado.strip()
        
        sugestoes = {
            'tipos_possiveis': [],
            'confianca': {},
            'detalhes': {}
        }
        
        # Verificar se é CPF
        if re.match(r'\d{3}\.?\d{3}\.?\d{3}-?\d{2}', texto_limpo):
            if self.base_service.validate_cpf(texto_limpo):
                sugestoes['tipos_possiveis'].append('cpf')
                sugestoes['confianca']['cpf'] = 0.95
                sugestoes['detalhes']['cpf'] = 'CPF com formato válido'
            else:
                sugestoes['tipos_possiveis'].append('cpf')
                sugestoes['confianca']['cpf'] = 0.7
                sugestoes['detalhes']['cpf'] = 'Formato de CPF (validação falhou)'
        
        # Verificar se é CNPJ
        if re.match(r'\d{2}\.?\d{3}\.?\d{3}/?0001-?\d{2}', texto_limpo):
            sugestoes['tipos_possiveis'].append('cnpj')
            sugestoes['confianca']['cnpj'] = 0.9
            sugestoes['detalhes']['cnpj'] = 'CNPJ identificado'
        
        # Verificar se é processo CNJ
        if re.match(r'\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}', texto_limpo):
            sugestoes['tipos_possiveis'].append('processo')
            sugestoes['confianca']['processo'] = 0.95
            sugestoes['detalhes']['processo'] = 'Número de processo CNJ'
        
        # Verificar se é nome (múltiplas palavras com maiúsculas)
        if re.match(r'^[A-ZÀ-ÚÇ][A-Za-zÀ-ÿç\s]+[A-ZÀ-ÚÇ][A-Za-zÀ-ÿç]+$', texto_limpo):
            palavras = texto_limpo.split()
            if len(palavras) >= 2 and len(texto_limpo) >= 10:
                if self.base_service._is_valid_person_name(texto_limpo):
                    sugestoes['tipos_possiveis'].append('nome')
                    confianca = min(0.85, 0.4 + (len(palavras) * 0.15))
                    sugestoes['confianca']['nome'] = confianca
                    sugestoes['detalhes']['nome'] = f'Nome com {len(palavras)} palavras'
        
        # Verificar se é empresa
        if re.search(r'(eireli|ltda|empreendimentos|s\.?a\.?)', texto_limpo, re.IGNORECASE):
            if self.base_service._is_valid_company_name(texto_limpo):
                sugestoes['tipos_possiveis'].append('empresa')
                sugestoes['confianca']['empresa'] = 0.8
                sugestoes['detalhes']['empresa'] = 'Nome de empresa identificado'
        
        # Verificar se é endereço
        if re.search(r'(rua|avenida|alameda|praça)', texto_limpo, re.IGNORECASE):
            if self.base_service._is_valid_address(texto_limpo):
                sugestoes['tipos_possiveis'].append('endereco')
                sugestoes['confianca']['endereco'] = 0.8
                sugestoes['detalhes']['endereco'] = 'Endereço identificado'
        
        # Verificar se é valor monetário
        if re.search(r'R?\$?\s*\d+[,.]?\d*', texto_limpo):
            sugestoes['tipos_possiveis'].append('valor')
            sugestoes['confianca']['valor'] = 0.7
            sugestoes['detalhes']['valor'] = 'Valor monetário'
        
        # Verificar se é OAB
        if re.search(r'oab', texto_limpo, re.IGNORECASE):
            sugestoes['tipos_possiveis'].append('oab')
            sugestoes['confianca']['oab'] = 0.9
            sugestoes['detalhes']['oab'] = 'Registro OAB'
        
        # Se não identificou nada específico, sugerir opções genéricas
        if not sugestoes['tipos_possiveis']:
            sugestoes['tipos_possiveis'] = ['nome', 'endereco', 'outros']
            sugestoes['confianca'] = {'outros': 0.5}
            sugestoes['detalhes'] = {'outros': 'Tipo não identificado automaticamente'}
        
        return sugestoes
    
    def get_manual_anonymizations(self, anonimizacao_id: int) -> dict:
        """Lista todas as anonimizações manuais para um documento."""
        try:
            anonimizacao = DocumentoAnonimizacao.objects.get(id=anonimizacao_id)
            
            itens_manuais = AnonimizacaoItem.objects.filter(
                anonimizacao=anonimizacao,
                anonimizado_manualmente=True
            ).order_by('-data_criacao')
            
            lista_itens = []
            for item in itens_manuais:
                lista_itens.append({
                    'id': item.id,
                    'tipo': item.tipo_dado,
                    'valor_original': item.valor_original,
                    'placeholder': item.valor_anonimizado,
                    'contexto': item.contexto,
                    'data_criacao': item.data_criacao.isoformat()
                })
            
            # Estatísticas
            total_automaticas = AnonimizacaoItem.objects.filter(
                anonimizacao=anonimizacao,
                anonimizado_manualmente=False
            ).count()
            
            total_manuais = len(lista_itens)
            
            return {
                'success': True,
                'itens_manuais': lista_itens,
                'estatisticas': {
                    'total_automaticas': total_automaticas,
                    'total_manuais': total_manuais,
                    'total_geral': total_automaticas + total_manuais
                }
            }
            
        except DocumentoAnonimizacao.DoesNotExist:
            return {
                'success': False,
                'error': 'Documento não encontrado'
            }
        except Exception as e:
            logger.error(f"❌ Erro ao listar anonimizações manuais: {e}")
            return {
                'success': False,
                'error': 'Erro interno'
            }
    
    def _detect_data_type(self, texto: str) -> str:
        """Auto-detecção do tipo de dado com base em padrões."""
        sugestoes = self.get_suggestions_for_selection(texto)
        
        if sugestoes['tipos_possiveis']:
            # Retorna o tipo com maior confiança
            tipos_com_confianca = sugestoes['confianca']
            if tipos_com_confianca:
                return max(tipos_com_confianca.items(), key=lambda x: x[1])[0]
            else:
                return sugestoes['tipos_possiveis'][0]
        
        return 'outros'
    
    def _get_next_manual_placeholder(self, anonimizacao_id: int, tipo: str) -> str:
        """Gera placeholder único para substituição manual."""
        # Contar quantos manuais já existem deste tipo
        count = AnonimizacaoItem.objects.filter(
            anonimizacao_id=anonimizacao_id,
            tipo_dado=f'{tipo}_manual'
        ).count() + 1
        
        return f"[{tipo.upper()}_MANUAL_{count}]"
    
    def _find_context_in_text(self, texto_completo: str, texto_busca: str, tamanho_contexto: int = 30) -> str:
        """Encontra contexto do texto no documento."""
        try:
            posicao = texto_completo.find(texto_busca)
            if posicao == -1:
                return "Contexto não encontrado"
            
            inicio = max(0, posicao - tamanho_contexto)
            fim = min(len(texto_completo), posicao + len(texto_busca) + tamanho_contexto)
            
            contexto = texto_completo[inicio:fim].replace('\n', ' ').strip()
            return contexto[:150]  # Limitar tamanho
            
        except Exception:
            return "Erro ao extrair contexto"

# Alias
AnonymizationService = WorkingAnonymizationService