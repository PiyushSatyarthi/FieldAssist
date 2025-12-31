from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
import os
import uuid

# -----------------------------
# Embedding model (offline)
# -----------------------------
model = SentenceTransformer("all-MiniLM-L6-v2")

# -----------------------------
# Persistent ChromaDB storage
# -----------------------------
CHROMA_DIR = "data/chroma"

client = chromadb.Client(
    Settings(
        persist_directory=CHROMA_DIR,
        anonymized_telemetry=False
    )
)

collection = client.get_or_create_collection(
    name="knowledge"
)

# -----------------------------
# Ingest documents (run once)
# -----------------------------
def ingest_docs(folder: str, chunk_size: int = 800):
    """
    Ingest text/markdown files into ChromaDB.
    Should be run once or when new files are added.
    """

    for file in os.listdir(folder):
        if not file.endswith((".txt", ".md")):
            continue

        path = os.path.join(folder, file)

        with open(path, "r", encoding="utf-8") as f:
            text = f.read().strip()

        if not text:
            continue

        chunks = [
            text[i : i + chunk_size]
            for i in range(0, len(text), chunk_size)
        ]

        for i, chunk in enumerate(chunks):
            embedding = model.encode(chunk).tolist()

            collection.add(
                documents=[chunk],
                embeddings=[embedding],
                ids=[f"{file}-{i}-{uuid.uuid4()}"],
                metadatas=[{"source": file}]
            )

    client.persist()
    print("✅ Knowledge ingestion complete")


# -----------------------------
# Retrieve relevant knowledge
# -----------------------------
def retrieve(query: str, k: int = 5):
    """
    Retrieve top-k relevant chunks for a query.
    Returns a list of text chunks.
    """

    embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[embedding],
        n_results=k
    )

    # Safety: handle empty DB or no matches
    if not results or not results.get("documents"):
        return []

    return results["documents"][0]
