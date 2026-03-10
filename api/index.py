import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

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

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": request.message}],
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def home():
    return {"status": "Backend funcionando"}