from datasets import load_dataset
from qdrant_client.models import PointStruct
import uuid

from app.services.embeddings import embed_text
from app.db.vector_store import create_collection, insert_documents, COLLECTION

# Load the agriculture QA dataset
dataset = load_dataset("KisanVaani/agriculture-qa-english-only")

# Ensure the Qdrant collection exists (uses the same local client as the app)
create_collection()

points = []

for row in dataset["train"]:

    text = row["question"] + " " + row["answers"]

    vector = embed_text(text)

    points.append(
        PointStruct(
            id=str(uuid.uuid4()),
            vector=vector,
            payload={"text": text}
        )
    )

# Use the shared insert function so we go through the same client
insert_documents(points)

print("Dataset indexed successfully")