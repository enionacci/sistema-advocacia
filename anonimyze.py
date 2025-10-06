# demo_gpt_oss_120b.py
import os
from huggingface_hub import InferenceClient

# -------------------------------------------------
# 1) Configurações
# -------------------------------------------------
HF_TOKEN = os.getenv("HF_TOKEN")                 # <-- defina na sua envvar
MODEL_ID = "gpt-oss/120b-cloud"

client = InferenceClient(model=MODEL_ID)         # token é lido da envvar

# -------------------------------------------------
# 2) Prompt de exemplo (anonimização)
# -------------------------------------------------
prompt = """\
Você é um assistente que anonimiza textos. 
Receba o seguinte parágrafo e devolva‑o substituindo:
  - Nomes por NOME1, NOME2…
  - Endereços por ENDERECO1, ENDERECO2…
  - CPFs por CPF1, CPF2…
Depois apresente um relatório com as substituições.

Parágrafo:
Fulano de Tal mora na Rua dos Pinheiros, 123, São Paulo – SP. Seu CPF é 527.653.851‑00.
"""

# -------------------------------------------------
# 3) Chamada ao modelo
# -------------------------------------------------
response = client.text_generation(
    prompt,
    max_new_tokens=512,
    temperature=0.7,
    top_k=50,
    do_sample=True,
)

print("\n=== Resposta do modelo ===\n")
print(response)
