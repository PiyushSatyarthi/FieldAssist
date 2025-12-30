from sentence_transformers import SentenceTransformer
import chromadb
import os

model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.Client()
collection = client.get_or_create_collection("knowledge")

def ingest_docs(folder):
    for file in os.listdir(folder):
        path = os.path.join(folder,file)
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
            chunks = [text[i:i+800] for i in range(0,len(text),800)]
            for chunk in chunks:
                emb = model.encode(chunk).tolist()
                collection.add(documents=[chunk],embeddings=[emb])

def retrieve(query):
    emb = model.encode(query).tolist()
    res = collection.query(query_embeddings=[emb], n_results=5)
    return res["documents"][0]