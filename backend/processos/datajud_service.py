"""
Serviço para integração com a API DataJud do CNJ
"""
import requests
import json
from typing import Dict, Any, Optional
from datetime import datetime


class DataJudService:
    """
    Serviço para consultar processos na API do PJe (Processo Judicial Eletrônico)
    """
    
    # Endpoint da API PJe
    PJE_ENDPOINT = 'https://comunicaapi.pje.jus.br/api/v1/comunicacao'
    
    def __init__(self):
        """
        Inicializa o serviço com o endpoint do PJe
        """
        self.endpoint = self.PJE_ENDPOINT
        self.headers = {
            'Content-Type': 'application/json'
        }
    
    def buscar_processo(self, numero_processo: str) -> Dict[str, Any]:
        """
        Busca informações de um processo na API do PJe
        
        Args:
            numero_processo: Número do processo (com ou sem formatação)
            
        Returns:
            Dicionário com os dados do processo ou erro
        """
        try:
            # Remove formatação do número
            numero_limpo = ''.join(filter(str.isdigit, numero_processo))
            
            if len(numero_limpo) != 20:
                return {
                    'sucesso': False,
                    'erro': 'Número do processo deve ter 20 dígitos no formato CNJ'
                }
            
            print(f"\n🔍 Consultando PJe API")
            print(f"📝 Processo: {numero_limpo}")
            print(f"🔗 Endpoint: {self.endpoint}")
            
            # Monta a URL com query parameter
            url = f"{self.endpoint}?numeroProcesso={numero_limpo}"
            
            print(f"🌐 URL completa: {url}")
            
            # Faz a requisição GET
            response = requests.get(
                url,
                headers=self.headers,
                timeout=30
            )
            
            print(f"� Status Code: {response.status_code}")
            print(f"📄 Response (primeiros 500 chars): {response.text[:500]}")
            
            if response.status_code != 200:
                return {
                    'sucesso': False,
                    'erro': f'Erro na API PJe: {response.status_code} - {response.text}'
                }
            
            data = response.json()
            
            # Verifica se há dados - a API retorna {"status": "success", "items": [...]}
            if not data or data.get('status') != 'success':
                return {
                    'sucesso': False,
                    'erro': 'Erro na resposta da API PJe'
                }
            
            items = data.get('items', [])
            if not items or len(items) == 0:
                return {
                    'sucesso': False,
                    'erro': 'Processo não encontrado na API PJe'
                }
            
            # Pega o primeiro item (comunicação mais recente)
            processo_data = items[0]
            
            print(f"✅ Processo encontrado! {len(items)} comunicações encontradas")
            print(f"📄 Classe: {processo_data.get('nomeClasse', 'N/A')}")
            print(f"🏛️ Órgão: {processo_data.get('nomeOrgao', 'N/A')}")
            
            # Formata os dados para o formato do sistema (passa todas as comunicações)
            return self._formatar_dados_processo(processo_data, items)
            
        except requests.Timeout:
            return {
                'sucesso': False,
                'erro': 'Timeout ao consultar a API DataJud. Tente novamente.'
            }
        except requests.RequestException as e:
            return {
                'sucesso': False,
                'erro': f'Erro de conexão com a API DataJud: {str(e)}'
            }
        except Exception as e:
            print(f"❌ Erro inesperado: {str(e)}")
            return {
                'sucesso': False,
                'erro': f'Erro ao processar resposta da API: {str(e)}'
            }
    
    def _formatar_dados_processo(self, data: Dict[str, Any], todas_comunicacoes: list = None) -> Dict[str, Any]:
        """
        Formata os dados do processo retornados pela API PJe para o formato do sistema
        
        Args:
            data: Dados brutos da API PJe (um item de comunicação)
            todas_comunicacoes: Lista completa de todas as comunicações do processo
            
        Returns:
            Dicionário formatado com os dados do processo
        """
        try:
            print(f"🔄 Formatando dados do PJe...")
            
            if todas_comunicacoes is None:
                todas_comunicacoes = [data]
            
            # Extrai informações básicas da comunicação
            numero_processo = data.get('numero_processo', '')
            
            # Classe processual
            classe = data.get('nomeClasse', '')
            
            # Extrai assunto do texto da comunicação (geralmente após a classe)
            texto = data.get('texto', '')
            assunto = ''
            
            # Tenta extrair assunto do padrão "Número - Classe - Assunto - ..."
            if ' - ' in texto:
                partes_texto = texto.split(' - ')
                if len(partes_texto) >= 2:
                    # Segunda parte: assunto
                    assunto = partes_texto[1].strip()
            
            # Se não encontrou no texto, usa a própria classe
            if not assunto:
                assunto = classe
            
            # PRIORIDADE: Extrai nomes das partes dos destinatários
            # destinatarios = partes do processo (não advogados)
            # polo "A" = Autor/Ativo
            # polo "P" = Réu/Passivo
            autor = ''
            reu = ''
            
            destinatarios = data.get('destinatarios', [])
            if destinatarios:
                for dest in destinatarios:
                    nome = dest.get('nome', '').strip()
                    polo = dest.get('polo', '')
                    
                    if polo == 'A' and nome:  # Autor
                        autor = nome
                    elif polo == 'P' and nome:  # Réu/Passivo
                        reu = nome
            
            # Observação: Alguns processos podem ter apenas o autor (polo A) nas intimações
            # O réu pode estar vazio se não houver polo P nos destinatários
            
            # Tribunal
            tribunal = data.get('siglaTribunal', 'TJSP')
            
            # Vara/Órgão
            vara = data.get('nomeOrgao', '')
            
            # Data de distribuição - deixar vazio para preenchimento manual
            # A data_disponibilizacao é da intimação, não da distribuição
            data_distribuicao = None
            
            # Última movimentação (a própria comunicação mais recente)
            ultima_movimentacao = {
                'data': data.get('data_disponibilizacao', ''),
                'descricao': data.get('tipoComunicacao', '') + ': ' + (texto[:200] if texto else '')
            }
            
            # Processa TODAS as comunicações para gerar movimentações
            movimentacoes_list = self._processar_movimentacoes(todas_comunicacoes)
            
            # REMOVIDO: Detecção automática de prazos e audiências via regex
            # Agora será feita manualmente ou via análise de IA
            
            # Monta resposta formatada
            resultado = {
                'sucesso': True,
                'dados': {
                    'numero_processo': self._formatar_numero_cnj(numero_processo),
                    'classe': classe,
                    'assunto': assunto,
                    'assuntos_secundarios': '',  # API não fornece assuntos secundários
                    'tribunal': tribunal,
                    'vara': vara,
                    'data_distribuicao': data_distribuicao,
                    'ultima_movimentacao': ultima_movimentacao,
                },
                # Dados extras para criar após salvar o processo
                'partes_info': {
                    'autor': autor,
                    'reu': reu,
                },
                'movimentacoes_list': movimentacoes_list,
                # Prazos e audiências serão criados manualmente ou via IA
                'prazos_list': [],
                'audiencias_list': [],
            }
            
            print(f"✅ Dados formatados:")
            print(f"   📝 Número: {resultado['dados']['numero_processo']}")
            print(f"   📁 Classe: {resultado['dados']['classe']}")
            print(f"   📋 Assunto: {resultado['dados']['assunto']}")
            print(f"   👤 Autor: {autor}")
            print(f"   👤 Réu: {reu}")
            print(f"   🏛️ Tribunal: {resultado['dados']['tribunal']}")
            print(f"   ⚖️ Vara: {resultado['dados']['vara']}")
            print(f"   📬 Movimentações: {len(movimentacoes_list)}")
            print(f"   ℹ️ Prazos e audiências podem ser extraídos via análise de IA")
            
            return resultado
            
        except Exception as e:
            print(f"❌ Erro ao formatar dados: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'sucesso': False,
                'erro': f'Erro ao formatar dados do processo: {str(e)}'
            }
    
    def _processar_movimentacoes(self, comunicacoes: list) -> list:
        """
        Processa lista de comunicações e retorna movimentações formatadas
        """
        movimentacoes = []
        
        for com in comunicacoes:
            mov = {
                'data_movimentacao': com.get('data_disponibilizacao', ''),
                'tipo': self._mapear_tipo_movimentacao(com.get('tipoComunicacao', '')),
                'descricao': com.get('texto', ''),  # Texto completo sem truncar
                'importante': 'Intimação' in com.get('tipoComunicacao', ''),
                'lido': False
            }
            movimentacoes.append(mov)
        
        print(f"   📝 {len(movimentacoes)} movimentações processadas")
        return movimentacoes
    
    def _mapear_tipo_movimentacao(self, tipo_comunicacao: str) -> str:
        """
        Mapeia tipo de comunicação PJe para tipo de movimentação do sistema
        """
        mapeamento = {
            'Intimação': 'intimacao',
            'Citação': 'intimacao',
            'Despacho': 'despacho',
            'Decisão': 'decisao',
            'Sentença': 'sentenca',
            'Certidão': 'certidao',
        }
        return mapeamento.get(tipo_comunicacao, 'outro')
    
    def _detectar_prazos(self, comunicacoes: list) -> list:
        """
        Detecta prazos nas intimações
        """
        import re
        from datetime import datetime, timedelta
        
        prazos = []
        
        for com in comunicacoes:
            if 'Intimação' not in com.get('tipoComunicacao', ''):
                continue
            
            texto = com.get('texto', '')
            data_intimacao = com.get('data_disponibilizacao', '')
            
            # Detecta prazos no texto (ex: "15 dias", "10 (dez) dias")
            padroes_prazo = [
                r'(?:prazo|manifestar|apresentar|no\s+prazo)\s+(?:de\s+)?(\d+)\s+(?:\([^)]+\)\s+)?dias?',
                r'(?:em|no\s+prazo\s+de)\s+(\d+)\s+dias?'
            ]
            
            for padrao in padroes_prazo:
                matches = re.finditer(padrao, texto, re.IGNORECASE)
                for match in matches:
                    dias_prazo = int(match.group(1))
                    
                    # Extrai a ação (para quê é o prazo)
                    acao = self._extrair_acao_prazo(texto, match.start())
                    
                    # Calcula data limite (ignora fins de semana por simplicidade)
                    try:
                        data_inicio = datetime.fromisoformat(data_intimacao.replace('Z', '+00:00')).date() if data_intimacao else datetime.now().date()
                        data_limite = data_inicio + timedelta(days=dias_prazo + 1)  # +1 para começar a contar do dia seguinte
                        
                        # Monta descrição mais clara
                        if acao:
                            descricao = f"Prazo para {acao} ({dias_prazo} dias)"
                        else:
                            # Se não detectou ação específica, tenta extrair a frase do prazo
                            trecho_prazo = self._extrair_trecho_prazo(texto, match.start(), match.end())
                            if trecho_prazo:
                                descricao = f"Prazo: {trecho_prazo} ({dias_prazo} dias)"
                            else:
                                descricao = f"Prazo de {dias_prazo} dias"
                        
                        prazo = {
                            'descricao': descricao,
                            'data_inicio': data_inicio.isoformat(),
                            'data_limite': data_limite.isoformat(),
                            'prazo_dias': dias_prazo,
                            'status': 'pendente',
                            'prioridade': 'alta' if dias_prazo <= 5 else 'media'
                        }
                        prazos.append(prazo)
                        print(f"   ⏰ Prazo detectado: {descricao} até {data_limite}")
                        break  # Só pega o primeiro prazo de cada intimação
                    except:
                        pass
        
        return prazos
    
    def _extrair_acao_prazo(self, texto: str, posicao_prazo: int) -> str:
        """
        Extrai a ação (finalidade) do prazo a partir do contexto do texto
        Ex: "manifestar", "contestar", "informar", "apresentar documentos"
        """
        import re
        
        # Converte texto para lowercase para facilitar busca
        texto_lower = texto.lower()
        
        # Padrões de ações comuns em intimações (ordem de prioridade)
        padroes_acao = [
            # Contestação
            (r'apresentar\s+(?:a\s+)?contesta[çc][aã]o', 'apresentar contestação'),
            (r'contestar', 'contestar'),
            
            # Manifestação
            (r'apresentar\s+manifesta[çc][aã]o', 'apresentar manifestação'),
            (r'manifestar(?:-se)?', 'manifestar-se'),
            (r'pronunciar(?:-se)?', 'pronunciar-se'),
            
            # Contrarrazões e razões
            (r'apresentar\s+(?:as?\s+)?contrarraz[õo]es', 'apresentar contrarrazões'),
            (r'apresentar\s+(?:as?\s+)?raz[õo]es', 'apresentar razões'),
            
            # Impugnação
            (r'impugnar', 'impugnar'),
            (r'apresentar\s+impugna[çc][aã]o', 'apresentar impugnação'),
            
            # Documentos
            (r'juntar\s+document(?:o|os)', 'juntar documentos'),
            (r'apresentar\s+document(?:o|os)', 'apresentar documentos'),
            (r'providenciar\s+document(?:o|os)', 'providenciar documentos'),
            
            # Comprovação
            (r'comprovar', 'comprovar'),
            (r'demonstrar', 'demonstrar'),
            
            # Regularização
            (r'regularizar', 'regularizar'),
            (r'emendar\s+(?:a\s+)?inicial', 'emendar a inicial'),
            (r'suprir\s+(?:a\s+)?irregularidade', 'suprir irregularidade'),
            
            # Cumprimento
            (r'cumprir\s+(?:a\s+)?decis[aã]o', 'cumprir decisão'),
            (r'cumprir\s+(?:o\s+)?despacho', 'cumprir despacho'),
            (r'cumprir', 'cumprir'),
            
            # Informações
            (r'informar', 'informar'),
            (r'prestar\s+informa[çc][õo]es', 'prestar informações'),
            
            # Recursos
            (r'recorrer', 'recorrer'),
            (r'interpor\s+recurso', 'interpor recurso'),
            
            # Provas
            (r'especificar\s+provas', 'especificar provas'),
            (r'requerer\s+provas', 'requerer provas'),
            (r'produzir\s+provas', 'produzir provas'),
            
            # Pagamento
            (r'efetuar\s+(?:o\s+)?pagamento', 'efetuar pagamento'),
            (r'pagar', 'pagar'),
            (r'recolher\s+custas', 'recolher custas'),
            
            # Outros
            (r'dar\s+andamento', 'dar andamento'),
            (r'providenciar', 'providenciar'),
        ]
        
        # Tenta encontrar a ação no texto completo
        for padrao, acao in padroes_acao:
            if re.search(padrao, texto_lower):
                return acao
        
        return None
    
    def _extrair_trecho_prazo(self, texto: str, pos_inicio: int, pos_fim: int) -> str:
        """
        Extrai um trecho relevante ao redor da menção ao prazo
        """
        # Busca início da frase (volta até encontrar . ou início do texto)
        inicio_frase = texto.rfind('.', 0, pos_inicio)
        if inicio_frase == -1:
            inicio_frase = 0
        else:
            inicio_frase += 1  # Pula o ponto
        
        # Busca fim da frase (avança até encontrar . ou fim do texto)
        fim_frase = texto.find('.', pos_fim)
        if fim_frase == -1:
            fim_frase = min(len(texto), pos_fim + 150)
        
        # Extrai e limpa o trecho
        trecho = texto[inicio_frase:fim_frase].strip()
        
        # Limita tamanho máximo
        if len(trecho) > 100:
            trecho = trecho[:100] + "..."
        
        return trecho
    
    def _detectar_audiencias(self, comunicacoes: list) -> list:
        """
        Detecta audiências nas comunicações
        """
        import re
        from datetime import datetime
        
        audiencias = []
        
        for com in comunicacoes:
            texto = com.get('texto', '')
            
            # Detecta menção a audiência
            if not re.search(r'audiência', texto, re.IGNORECASE):
                continue
            
            # Tenta extrair tipo de audiência
            tipo = 'outras'
            if re.search(r'audiência\s+de\s+conciliação', texto, re.IGNORECASE):
                tipo = 'conciliacao'
            elif re.search(r'audiência\s+de\s+instrução', texto, re.IGNORECASE):
                tipo = 'instrucao'
            elif re.search(r'audiência\s+inicial', texto, re.IGNORECASE):
                tipo = 'inicial'
            
            # Tenta extrair data e hora (diversos formatos)
            # Ex: "dia 15/11/2025, às 14:30", "15/11/2025 - 14h30"
            padroes_data = [
                r'(\d{2}/\d{2}/\d{4})[,\s]+(?:às|as|-)?\s*(\d{1,2})[h:](\d{2})',
                r'(\d{2}/\d{2}/\d{4})',
            ]
            
            data_hora = None
            for padrao in padroes_data:
                match = re.search(padrao, texto)
                if match:
                    try:
                        data_str = match.group(1)
                        if len(match.groups()) >= 3:
                            hora = match.group(2)
                            minuto = match.group(3)
                            data_hora = datetime.strptime(f"{data_str} {hora}:{minuto}", "%d/%m/%Y %H:%M")
                        else:
                            data_hora = datetime.strptime(data_str, "%d/%m/%Y").replace(hour=9, minute=0)  # Assume 9h se não tem hora
                        break
                    except:
                        pass
            
            if data_hora:
                audiencia = {
                    'tipo': tipo,
                    'data_hora': data_hora.isoformat(),
                    'pauta': texto[:300],  # Primeiros 300 chars como pauta
                    'status': 'agendada',
                    'alertar': True
                }
                audiencias.append(audiencia)
                print(f"   🎤 Audiência detectada: {tipo} em {data_hora.strftime('%d/%m/%Y %H:%M')}")
        
        return audiencias
    
    def _formatar_numero_cnj(self, numero: str) -> str:
        """
        Formata número do processo no padrão CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO
        
        Args:
            numero: Número sem formatação (20 dígitos)
            
        Returns:
            Número formatado
        """
        if not numero or len(numero) < 20:
            return numero
        
        # Remove qualquer formatação existente
        numero_limpo = ''.join(filter(str.isdigit, numero))
        
        if len(numero_limpo) != 20:
            return numero
        
        # Aplica formatação CNJ
        return f"{numero_limpo[0:7]}-{numero_limpo[7:9]}.{numero_limpo[9:13]}.{numero_limpo[13]}.{numero_limpo[14:16]}.{numero_limpo[16:20]}"
