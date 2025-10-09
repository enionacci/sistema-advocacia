"""
Serviço para processamento de OCR e Análise com IA
"""

import os
import io
import platform
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from django.core.files.base import ContentFile
from django.conf import settings
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
from openai import OpenAI
from .progress_service import progress_tracker


# Configuração do Tesseract para Windows
if platform.system() == 'Windows':
    # Tenta localizar o Tesseract em caminhos comuns
    possible_paths = [
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',
        r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
    ]
    for path in possible_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            # print(f"✅ Tesseract encontrado em: {path}"))
            break
    else:
        print("⚠️ Tesseract não encontrado. Instale em: https://github.com/UB-Mannheim/tesseract/wiki")


# Configuração do Poppler para Windows e Linux
POPPLER_PATH = None
if platform.system() == 'Windows':
    possible_poppler_paths = [
        r'C:\poppler\poppler-24.08.0\Library\bin',
        r'C:\Program Files\poppler\Library\bin',
        r'C:\ProgramData\chocolatey\lib\poppler\tools\Library\bin',
    ]
    for path in possible_poppler_paths:
        if os.path.exists(path):
            POPPLER_PATH = path
            # print(f"✅ Poppler encontrado em: {path}"))
            break
    else:
        print("⚠️ Poppler não encontrado. PDFs não serão suportados para OCR.")
elif platform.system() == 'Linux':
    # No Linux, poppler-utils instala os binários no PATH
    import shutil
    if shutil.which('pdftoppm'):
        POPPLER_PATH = None  # None significa usar PATH padrão
        print("✅ Poppler encontrado no sistema Linux")
    else:
        print("⚠️ Poppler não encontrado no Linux. Instale: apt-get install poppler-utils")


class OCRService:
    """
    Serviço para extração de texto de documentos (OCR)
    Suporta PDFs e imagens
    """
    
    @staticmethod
    def extract_text_from_pdf(arquivo_bytes: bytes, task_id: str = None) -> str:
        """
        Extrai texto de um PDF, tentando primeiro a extração direta e, se não houver
        texto, usa OCR.
        """
        from pypdf import PdfReader

        if not task_id:
            task_id = str(uuid.uuid4())

        try:
            # 1. Tenta extrair texto diretamente (para PDFs baseados em texto)
            progress_tracker.update_progress(task_id, 0, "Tentando extração direta de texto...")
            pdf_reader = PdfReader(io.BytesIO(arquivo_bytes))
            texto_completo = []
            total_paginas_texto = len(pdf_reader.pages)
            progress_tracker.set_total_pages(task_id, total_paginas_texto)

            for i, page in enumerate(pdf_reader.pages):
                texto_pagina = page.extract_text()
                if texto_pagina and texto_pagina.strip():
                    texto_completo.append(f"--- Página {i + 1} ---\n{texto_pagina}")
                progress_tracker.update_progress(task_id, i + 1)

            texto_final = "\n\n".join(texto_completo)

            # Se encontrou texto substancial, retorna
            if texto_final.strip():
                print("✅ PDF com texto. Extração direta concluída.")
                progress_tracker.complete_progress(task_id, True)
                return texto_final

            # 2. Se não houver texto, parte para o OCR (para PDFs de imagem/escaneados)
            print("⚠️ PDF sem texto detectado. Iniciando OCR...")
            progress_tracker.update_progress(task_id, 0, "PDF sem texto, iniciando OCR...")

            if platform.system() == 'Windows' and not POPPLER_PATH:
                msg = "Poppler não configurado para OCR em PDF de imagem."
                progress_tracker.complete_progress(task_id, False, msg)
                raise Exception(msg)

            progress_tracker.update_progress(task_id, 0, "Convertendo PDF para imagens...")
            images = convert_from_bytes(
                arquivo_bytes,
                dpi=300,
                fmt='png',
                poppler_path=POPPLER_PATH if platform.system() == 'Windows' else None
            )

            total_paginas_ocr = len(images)
            progress_tracker.set_total_pages(task_id, total_paginas_ocr)
            texto_ocr = []

            for i, image in enumerate(images):
                pagina_atual = i + 1
                print(f"📄 Processando OCR da página {pagina_atual}/{total_paginas_ocr}...")
                progress_tracker.update_progress(task_id, pagina_atual)
                
                texto = pytesseract.image_to_string(image, lang='por', config='--psm 6')
                if texto.strip():
                    texto_ocr.append(f"--- Página {i + 1} ---\n{texto}")

            texto_final_ocr = "\n\n".join(texto_ocr)
            progress_tracker.complete_progress(task_id, True)
            return texto_final_ocr

        except Exception as e:
            error_message = f"Erro ao extrair texto do PDF: {str(e)}"
            progress_tracker.complete_progress(task_id, False, error_message)
            # Adiciona log do erro no console para depuração
            print(f"❌ {error_message}")
            # Relança a exceção para que a view possa capturá-la
            raise Exception(error_message)

    
    @staticmethod
    def extract_text_from_image(arquivo_bytes: bytes) -> str:
        """
        Extrai texto de uma imagem usando OCR
        
        Args:
            arquivo_bytes: Bytes do arquivo de imagem
            
        Returns:
            Texto extraído da imagem
        """
        try:
            # Abre a imagem
            image = Image.open(io.BytesIO(arquivo_bytes))
            
            # Extrai texto
            texto = pytesseract.image_to_string(
                image,
                lang='por',
                config='--psm 6'
            )
            
            return texto
            
        except Exception as e:
            raise Exception(f"Erro ao extrair texto da imagem: {str(e)}")
    
    @staticmethod
    def extract_text(arquivo_path: str, tipo_arquivo: str, task_id: str = None) -> str:
        """
        Extrai texto de um arquivo (PDF ou imagem)
        
        Args:
            arquivo_path: Caminho do arquivo
            tipo_arquivo: Tipo do arquivo (pdf, jpg, png, etc)
            task_id: ID da tarefa para rastreamento de progresso
            
        Returns:
            Texto extraído
        """
        with open(arquivo_path, 'rb') as f:
            arquivo_bytes = f.read()
        
        if tipo_arquivo.lower() == 'pdf':
            return OCRService.extract_text_from_pdf(arquivo_bytes, task_id)
        elif tipo_arquivo.lower() in ['jpg', 'jpeg', 'png', 'tiff', 'bmp']:
            return OCRService.extract_text_from_image(arquivo_bytes)
        else:
            raise ValueError(f"Tipo de arquivo não suportado para OCR: {tipo_arquivo}")


class AIAnalysisService:
    """
    Serviço para análise de documentos usando IA (OpenAI GPT)
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Inicializa o serviço de IA
        
        Args:
            api_key: Chave da API da OpenAI (opcional, usa do escritório se não fornecida)
        """
        self.api_key = api_key
        self.client = None
        
        if api_key:
            self.client = OpenAI(api_key=api_key)
    
    def get_prompt_template(self, tipo_analise: str) -> str:
        """
        Retorna o template de prompt para cada tipo de análise
        
        Args:
            tipo_analise: Tipo da análise
            
        Returns:
            Template do prompt
        """
        templates = {
            'resumo': """
                Você é um assistente jurídico especializado. Analise o seguinte documento e forneça um resumo executivo detalhado.
                
                O resumo deve conter:
                - Tipo de documento
                - Principais pontos e informações relevantes
                - Partes envolvidas (se aplicável)
                - Valores e datas importantes
                - Conclusão/Síntese
                
                Documento:
                {texto}
            """,
            
            'extracao_dados': """
                Você é um assistente jurídico especializado em extração de dados. Analise o seguinte documento e extraia todas as informações estruturadas possíveis.
                
                Retorne um JSON com os seguintes campos (quando aplicável):
                - tipo_documento
                - numero_documento
                - data_emissao
                - data_vencimento
                - partes: [lista de pessoas/empresas envolvidas]
                - valores: [lista de valores monetários]
                - enderecos: [lista de endereços]
                - telefones: [lista de telefones]
                - emails: [lista de emails]
                - outras_informacoes_relevantes
                
                Documento:
                {texto}
                
                IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
            """,
            
            'juridico': """
                Você é um advogado especialista. Analise o seguinte documento sob a perspectiva jurídica.
                
                Forneça:
                1. **Natureza Jurídica**: Tipo de documento e sua finalidade legal
                2. **Análise de Cláusulas**: Pontos importantes e suas implicações
                3. **Riscos Identificados**: Possíveis problemas ou riscos legais
                4. **Recomendações**: Sugestões de ação ou pontos de atenção
                5. **Base Legal**: Leis e normas aplicáveis (se identificadas)
                
                Documento:
                {texto}
            """,
            
            'contrato': """
                Você é um advogado especialista em contratos. Analise o seguinte contrato detalhadamente.
                
                Forneça análise completa contendo:
                1. **Tipo de Contrato**: Classificação e natureza
                2. **Partes Contraentes**: Identificação das partes
                3. **Objeto do Contrato**: O que está sendo contratado
                4. **Obrigações das Partes**: Resumo das obrigações de cada parte
                5. **Prazo e Vigência**: Duração e renovação
                6. **Valores e Pagamento**: Condições financeiras
                7. **Cláusulas Importantes**: Destaque de cláusulas relevantes
                8. **Penalidades**: Multas, juros, rescisão
                9. **Pontos de Atenção**: Cláusulas que merecem atenção especial
                10. **Recomendações**: Sugestões de alteração ou negociação
                
                Contrato:
                {texto}
            """,
            
            'risco': """
                Você é um advogado especialista em análise de risco. Analise o seguinte documento para identificar possíveis riscos jurídicos e financeiros.
                
                Forneça:
                1. **Riscos Jurídicos**: Potenciais problemas legais
                2. **Riscos Financeiros**: Possíveis impactos financeiros
                3. **Riscos Contratuais**: Problemas nas cláusulas
                4. **Nível de Risco**: Baixo, Médio ou Alto (justifique)
                5. **Medidas Mitigadoras**: Ações para reduzir riscos
                6. **Recomendação Final**: Proceder, renegociar ou rejeitar
                
                Documento:
                {texto}
            """
        }
        
        return templates.get(tipo_analise, "{texto}")
    
    def analyze_document(
        self,
        texto: str,
        tipo_analise: str,
        prompt_personalizado: Optional[str] = None,
        modelo: str = 'gpt-4'
    ) -> Dict[str, Any]:
        """
        Analisa um documento usando IA
        
        Args:
            texto: Texto do documento
            tipo_analise: Tipo de análise
            prompt_personalizado: Prompt personalizado (opcional)
            modelo: Modelo da OpenAI a usar
            
        Returns:
            Dict com resultado, tokens e custo
        """
        if not self.client:
            raise Exception("API Key da OpenAI não configurada")
        
        inicio = datetime.now()
        
        try:
            # Monta o prompt
            if prompt_personalizado:
                prompt = f"{prompt_personalizado}\n\nDocumento:\n{texto}"
            else:
                prompt_template = self.get_prompt_template(tipo_analise)
                prompt = prompt_template.format(texto=texto)
            
            # Determina parâmetros baseado no modelo
            api_params = {}
            
            # Modelos que usam max_completion_tokens e não suportam temperature personalizado
            if any(model_name in modelo.lower() for model_name in ['gpt-5', 'o1']):
                api_params['max_completion_tokens'] = 4000
                # Não adiciona temperature (usa padrão 1)
            # Modelos que usam max_completion_tokens mas suportam temperature
            elif any(model_name in modelo.lower() for model_name in ['gpt-4.1', 'gpt-4o-2024']):
                api_params['max_completion_tokens'] = 4000
                api_params['temperature'] = 0.3
            # Modelos antigos (GPT-4, GPT-3.5)
            else:
                api_params['max_tokens'] = 4000
                api_params['temperature'] = 0.3
            
            # Chama a API da OpenAI
            response = self.client.chat.completions.create(
                model=modelo,
                messages=[
                    {
                        "role": "system",
                        "content": "Você é um assistente jurídico especializado em análise de documentos legais."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                **api_params
            )
            
            # Extrai resposta
            resultado = response.choices[0].message.content
            tokens_usados = response.usage.total_tokens
            

            
            # Calcula custo estimado (valores aproximados GPT-4)
            custo_por_mil_tokens = 0.03  # USD
            custo_estimado = (tokens_usados / 1000) * custo_por_mil_tokens
            
            tempo_processamento = datetime.now() - inicio
            
            return {
                'resultado': resultado,
                'tokens_usados': tokens_usados,
                'custo_estimado': round(custo_estimado, 4),
                'tempo_processamento': tempo_processamento,
                'modelo_ia': modelo,
                'status': 'concluido'
            }
            
        except Exception as e:
            tempo_processamento = datetime.now() - inicio
            
            return {
                'resultado': '',
                'tokens_usados': 0,
                'custo_estimado': 0,
                'tempo_processamento': tempo_processamento,
                'modelo_ia': modelo,
                'status': 'erro',
                'mensagem_erro': str(e)
            }
