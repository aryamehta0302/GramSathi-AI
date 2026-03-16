from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from qdrant_client.models import PointStruct

# Local persistent storage (no docker/server required)
client = QdrantClient(path="./qdrant_storage")

COLLECTION = "gramsathi_docs"


def create_collection():

    collections = client.get_collections().collections
    collection_names = [c.name for c in collections]

    if COLLECTION not in collection_names:

        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )


def insert_documents(points):

    client.upsert(
        collection_name=COLLECTION,
        points=points
    )


def search_vectors(vector):

    response = client.query_points(
        collection_name=COLLECTION,
        query=vector,
        limit=5,
        with_payload=True,
    )

    docs = []

    for p in response.points:
        payload = p.payload or {}
        text = payload.get("text")
        if text is not None:
            docs.append(text)

    return docs