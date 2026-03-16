from fastapi import APIRouter
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.guardrails import validate_query
from app.services.rag_chain import run_rag

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest):

    if not validate_query(req.message):
        return {"answer": "Query blocked by guardrails"}

    answer, docs = run_rag(req.message)

    return {
        "answer": answer,
        "sources": docs
    }