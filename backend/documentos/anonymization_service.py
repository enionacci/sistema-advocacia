"""
Serviço de Anonimização Reversível de Documentos
Utiliza uma abordagem híbrida e final: O Microsoft Presidio orquestra
reconhecedores de regras (Regex) de alta precisão e o motor de NER do spaCy.
Um filtro de pós-processamento é aplicado para remover falsos positivos comuns
do NER, garantindo um equilíbrio entre cobertura e precisão.
"""

import re
from typing import Dict, List, Tuple

from django.utils import timezone

# Imports do Presidio
from presidio_analyzer import AnalyzerEngine, Pattern, PatternRecognizer
from presidio_analyzer.nlp_engine import NlpEngineProvider
from presidio_anonymizer import AnonymizerEngine

from .models import DocumentoAnonimizacao, AnonimizacaoItem

# --- Configuração do Motor do Presidio (Singleton) ---

ANALYZER = None

def get_presidio_analyzer():
    """Função para inicializar o AnalyzerEngine como um singleton."""
    global ANALYZER
    if ANALYZER:
        return ANALYZER

    print("⚙️ Inicializando o motor do Microsoft Presidio (modo híbrido)...")

    # --- Reconhecedores Customizados (Regex) para Português ---
    keyword_list = [
        'RECORRENTE EM RECURSO ESPECIAL', 'RECORRIDO EM RECURSO ESPECIAL', 'RECORRENTE EM RECURSO EXTRAORDINÁRIO',
        'RECORRIDO EM RECURSO EXTRAORDINÁRIO', 'EMBARGANTE DOS DECLARATÓRIOS', 'EMBARGADO DOS DECLARATÓRIOS',
        'REQUERENTE DA CAUTELAR', 'REQUERIDO DA CAUTELAR', 'REQUERENTE DA LIMINAR', 'REPRESENTANTE LEGAL',
        'DEVEDOR PRINCIPAL', 'ADMINISTRADOR JUDICIAL', 'TERCEIRO INTERESSADO', 'OUTORGANTE', 'OUTORGADO', 'REQUERENTE',
        'REQUERIDO', 'AUTOR', 'RÉU', 'APELANTE', 'APELADO', 'RECORRENTE', 'RECORRIDO', 'AGRAVANTE', 'AGRAVADO',
        'EMBARGANTE', 'EMBARGADO', 'IMPETRANTE', 'IMPETRADO', 'EXEQUENTE', 'EXECUTADO', 'DEVEDOR', 'CREDOR',
        'ASSISTENTE', 'OPOENTE', 'DENUNCIANTE', 'DENUNCIADO', 'CHAMANTE', 'CHAMADO', 'NOMEANTE', 'NOMEADO',
        'LITISCONSORTE', 'SUCESSOR', 'ESPÓLIO', 'INVENTARIANTE', 'HERDEIRO', 'CURADOR', 'TUTOR', 'PROCURADOR',
        'MANDATÁRIO', 'ACUSADO', 'ACUSADOR', 'QUERELANTE', 'QUERELADO', 'VÍTIMA', 'OFENDIDO', 'INVESTIGADO',
        'INDICIADO', 'TESTEMUNHA', 'INFORMANTE', 'AVALISTA', 'FIADOR', 'CODEVEDOR', 'SOLIDÁRIO', 'FALIDO',
        'CONCORDATÁRIO', 'RECUPERANDO', 'SÍNDICO', 'INTERESSADO', 'BENEFICIÁRIO', 'CEDENTE', 'CESSIONÁRIO',
        'LOCADOR', 'LOCATÁRIO', 'SEGURADO', 'SEGURADORA'
    ]
    keyword_regex = f"(?:{ '|'.join(re.escape(k) for k in keyword_list) }):\s*([A-ZÀ-Ú][A-ZÀ-Ú\s]+[A-ZÀ-Ú])(?=,)"
    qualification_regex = r'^\s*([A-ZÀ-Ú\s]{5,50})(?=\s*,\s*j[áa]\s*(?:devidamente\s*)?qualificad[oa])'
    nationality_regex = r'^\s*([A-ZÀ-Ú\s]{5,50})(?=\s*,\s*(?:brasileir[oa]|solteir[oa]|casad[oa]|divorciad[oa]|vi[úu]v[oa]|amasiad[oa]))'

    name_recognizer = PatternRecognizer(
        supported_entity="LEGAL_NAME", name="LegalNameRecognizer",
        patterns=[
            Pattern(name="KeywordNamePattern", regex=keyword_regex, score=0.95),
            Pattern(name="QualificationPattern", regex=qualification_regex, score=0.95),
            Pattern(name="NationalityPattern", regex=nationality_regex, score=0.95),
        ],
        supported_language="pt"
    )

    cpf_recognizer = PatternRecognizer(supported_entity="CPF", name="CpfRecognizer", patterns=[Pattern(name="CpfPattern", regex=r'\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b', score=0.9)], supported_language="pt")
    rg_recognizer = PatternRecognizer(supported_entity="RG", name="RgRecognizer", patterns=[Pattern(name="RgPattern", regex=r'\\b\\d{1,2}\\.?\\d{3}\\.?\\d{3}-?[0-9xX]\\b', score=0.9)], supported_language="pt")
    phone_recognizer = PatternRecognizer(supported_entity="PHONE_NUM", name="PhoneRecognizer", patterns=[Pattern(name="PhonePattern", regex=r'123456789', score=0.0)], supported_language="pt")
    email_recognizer = PatternRecognizer(supported_entity="EMAIL_ADDRESS", name="EmailRecognizer", patterns=[Pattern(name="EmailPattern", regex=r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', score=0.8)], supported_language="pt")
    processo_recognizer = PatternRecognizer(supported_entity="PROCESSO_CNJ", name="CnjProcessoRecognizer", patterns=[Pattern(name="CnjPattern", regex=r'\\b\\d{7}-\\d{2}\\. \\d{4}\\. \\d\\.\\d{2}\\. \\d{4}\\b', score=0.95)], supported_language="pt")

    try:
        nlp_config = {"nlp_engine_name": "spacy", "models": [{"lang_code": "pt", "model_name": "pt_core_news_lg"}]}
        nlp_engine = NlpEngineProvider(nlp_configuration=nlp_config).create_engine()
        ANALYZER = AnalyzerEngine(nlp_engine=nlp_engine, supported_languages=["pt"])
        print("✅ Motor de NLP (spaCy) carregado.")
    except Exception as e:
        print(f"❌ ERRO CRÍTICO: Não foi possível carregar o motor NLP (spaCy). A anonimização não funcionará. Erro: {e}")
        return None

    ANALYZER.registry.add_recognizer(name_recognizer)
    ANALYZER.registry.add_recognizer(cpf_recognizer)
    ANALYZER.registry.add_recognizer(rg_recognizer)
    ANALYZER.registry.add_recognizer(phone_recognizer)
    ANALYZER.registry.add_recognizer(email_recognizer)
    ANALYZER.registry.add_recognizer(processo_recognizer)
    
    print("✅ Motor do Presidio inicializado com SUCESSO (modo híbrido: Regras + IA).")
    return ANALYZER

# --- Lista de Exceções para o Filtro de Pós-Processamento ---

POST_PROCESSING_STOP_WORDS = {
    "vossa excelência", "excelentíssimo", "senhor", "doutor", "juiz", "direito",
    "tribunal", "justiça", "estado", "comarca", "vara", "partes", "autos", "art",
    "código", "processo", "civil", "resolução", "conselho", "nacional", "termos",
    "artigo", "parágrafo", "inciso", "presente", "pedido", "consequência", "mérito",
    "ação", "site", "documento", "cópia", "original", "guia", "recolhimento", "termos",
    "deferimento", "grau", "recurso", "sentença", "acórdão", "agravo", "petição",
    "inicial", "defesa", "contestação", "réplica", "liminar", "tutela", "urgência",
    "advocacia", "assessoria", "jurídica", "procuração", "outorgado", "outorgante"
}

# --- Serviço de Anonimização ---

class AnonymizationService:
    _counters = {}

    def __init__(self):
        self.analyzer = get_presidio_analyzer()
        self.anonymizer = AnonymizerEngine()

    @classmethod
    def reset_counters(cls):
        cls._counters = {}

    @classmethod
    def get_next_placeholder(cls, entity_type: str) -> str:
        type_map = {
            'PERSON': 'NOME', 'LEGAL_NAME': 'NOME', 'CPF': 'CPF', 'RG': 'RG',
            'PHONE_NUM': 'TELEFONE', 'EMAIL_ADDRESS': 'EMAIL', 'PROCESSO_CNJ': 'PROCESSO',
            'LOCATION': 'LOCAL'
        }
        mapped_type = type_map.get(entity_type.upper(), 'OUTRO')
        count = cls._counters.get(mapped_type, 0) + 1
        cls._counters[mapped_type] = count
        return f"{mapped_type}{count}"

    def anonymize_document(self, anonimizacao: DocumentoAnonimizacao) -> bool:
        if not self.analyzer:
            anonimizacao.status = 'erro'
            anonimizacao.mensagem_erro = "Motor de análise (Presidio) não foi inicializado."
            anonimizacao.save()
            return False
        try:
            print("🔒 Iniciando anonimização com Presidio (modo híbrido)...")
            self.reset_counters()
            anonimizacao.status = 'processando'
            anonimizacao.save()

            entities_to_anonymize = []
            if anonimizacao.anonimizar_nomes: entities_to_anonymize.extend(["PERSON", "LEGAL_NAME"])
            if anonimizacao.anonimizar_enderecos: entities_to_anonymize.append("LOCATION")
            if anonimizacao.anonimizar_cpf: entities_to_anonymize.append("CPF")
            if anonimizacao.anonimizar_rg: entities_to_anonymize.append("RG")
            if anonimizacao.anonimizar_telefones: entities_to_anonymize.append("PHONE_NUM")
            if anonimizacao.anonimizar_emails: entities_to_anonymize.append("EMAIL_ADDRESS")
            entities_to_anonymize.append("PROCESSO_CNJ")

            analyzer_results = self.analyzer.analyze(
                text=anonimizacao.texto_original, 
                entities=entities_to_anonymize, 
                language="pt",
                return_decision_process=True
            )
            print(f"🔍 Presidio encontrou {len(analyzer_results)} entidades potenciais.")

            filtered_results = []
            for res in analyzer_results:
                if res.analysis_explanation.recognizer != "SpacyRecognizer":
                    filtered_results.append(res)
                    continue
                
                matched_text = anonimizacao.texto_original[res.start:res.end]
                normalized_text = re.sub(r'\\s+', ' ', matched_text).lower().strip()
                
                if normalized_text in POST_PROCESSING_STOP_WORDS:
                    print(f"🚫 Descartando falso positivo (stop word): '{matched_text}'")
                    continue

                if re.search(r'https?://', matched_text):
                    print(f"🚫 Descartando falso positivo (URL): '{matched_text}'")
                    continue

                if ' ' not in matched_text and len(matched_text) > 12 and any(char.isdigit() for char in matched_text) and any(char.isalpha() for char in matched_text):
                    print(f"🚫 Descartando falso positivo (código alfanumérico): '{matched_text}'")
                    continue

                filtered_results.append(res)
            
            print(f"✨ Após o filtro, restaram {len(filtered_results)} entidades válidas.")

            db_items = []
            placeholder_map = {}
            texto_anonimizado = anonimizacao.texto_original

            sorted_results = sorted(filtered_results, key=lambda x: x.start, reverse=True)

            for res in sorted_results:
                valor_original = texto_anonimizado[res.start:res.end]
                valor_final = valor_original.strip()

                if res.analysis_explanation.recognizer == "LegalNameRecognizer":
                    match = re.search(res.analysis_explanation.pattern, valor_original, re.IGNORECASE)
                    if match and match.groups():
                        valor_final = match.group(1).strip()
                        offset = valor_original.find(valor_final)
                        res.start += offset
                        res.end = res.start + len(valor_final)
                
                if valor_final not in placeholder_map:
                    placeholder = self.get_next_placeholder(res.entity_type)
                    placeholder_map[valor_final] = placeholder
                    db_items.append({
                        'tipo_dado': re.match(r'([A-Z_]+)', placeholder).group(1).lower(),
                        'valor_original': valor_final,
                        'valor_anonimizado': placeholder,
                        'contexto': self._get_context(anonimizacao.texto_original, res.start, res.end)
                    })
                else:
                    placeholder = placeholder_map[valor_final]
                
                texto_anonimizado = texto_anonimizado[:res.start] + placeholder + texto_anonimizado[res.end:]

            anonimizacao.texto_anonimizado = texto_anonimizado
            anonimizacao.status = 'concluido'
            anonimizacao.data_conclusao = timezone.now()
            anonimizacao.save()

            for item_data in db_items:
                AnonimizacaoItem.objects.create(anonimizacao=anonimizacao, **item_data)

            print(f"✅ Anonimização com Presidio concluída. {len(db_items)} substituições salvas.")
            return True

        except Exception as e:
            import traceback
            traceback.print_exc()
            anonimizacao.status = 'erro'
            anonimizacao.mensagem_erro = str(e)
            anonimizacao.save()
            return False

    def _get_context(self, texto: str, inicio: int, fim: int, tamanho_contexto: int = 50) -> str:
        start_context = max(0, inicio - tamanho_contexto)
        end_context = min(len(texto), fim + tamanho_contexto)
        return texto[start_context:end_context].replace('\n', ' ').strip()

    def deanonymize_text(self, texto_anonimizado: str, anonimizacao_id: int) -> Tuple[str, int]:
        try:
            anonimizacao = DocumentoAnonimizacao.objects.get(id=anonimizacao_id)
            itens = anonimizacao.itens.all().order_by('-valor_original')
            
            if not itens.exists(): return texto_anonimizado, 0
            
            texto_resultante = texto_anonimizado
            substituicoes_realizadas = 0
            
            for item in itens:
                placeholder = item.valor_anonimizado
                valor_real = item.valor_original
                
                placeholders_a_verificar = [placeholder]
                if placeholder.startswith('TELEFONE'):
                    placeholders_a_verificar.append(placeholder.replace('TELEFONE', 'Fone'))

                for p in placeholders_a_verificar:
                    ocorrencias = texto_resultante.count(p)
                    if ocorrencias > 0:
                        texto_resultante = texto_resultante.replace(p, valor_real)
                        substituicoes_realizadas += ocorrencias
            
            return texto_resultante, substituicoes_realizadas
            
        except DocumentoAnonimizacao.DoesNotExist:
            raise Exception(f"Anonimização #{anonimizacao_id} não encontrada")
        except Exception as e:
            raise Exception(f"Erro na desanonimização: {str(e)}")