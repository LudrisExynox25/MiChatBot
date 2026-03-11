import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

print("Base de datos de vectores creada exitosamente.")

# Cambia esto en index.py
loader = PyPDFLoader("conceptosAlimentacion.pdf")
documentos = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
trozos = text_splitter.split_documents(documentos)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = FAISS.from_documents(trozos, embeddings)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Esto permite que tu Frontend (v0) se comunique con el Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite que tu web se conecte
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configura tu cliente de Groq
# Nota: La API Key la configuraremos en el servidor, no la escribas aquí directamente
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@app.post("/api")
async def chat(request: ChatRequest):
    try:
       # AQUI CONECTAMOS EL PASO 2 CON EL CHAT
        # Buscamos en el PDF los 3 fragmentos más parecidos a la pregunta
        docs = vector_db.similarity_search(request.message, k=3)
        contexto_pdf = "\n".join([doc.page_content for doc in docs])

        # Creamos un mensaje de sistema que obligue a usar el PDF
        system_message = (
            "Eres un experto en nutrición. Responde de forma concisa "
            "basándote ÚNICAMENTE en este contenido del PDF: \n\n"
            f"{contexto_pdf}"
        )

        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": request.message}
            ],
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def home():
    return {"status": "Backend funcionando"}