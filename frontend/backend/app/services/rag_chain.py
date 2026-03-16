import ollama
from app.services.embeddings import embed_text
from app.db.vector_store import search_vectors

SYSTEM_PROMPT = """
You are GramSathi AI.

Rules:
- Answer only from provided context
- If information not found say "Information not available"
- Provide concise advice
"""

def run_rag(query):

    query_vector = embed_text(query)

    docs = search_vectors(query_vector)

    context = "\n".join(docs)

    prompt = f"""
Context:
{context}

Question:
{query}

Answer clearly.
"""

    response = ollama.chat(
        model="llama3",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
    )

    return response["message"]["content"], docs