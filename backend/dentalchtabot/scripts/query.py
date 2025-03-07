import pickle
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from langchain_ollama import OllamaLLM

# ------------------------------
# 1️⃣ Load FAISS Index & Text
# ------------------------------
def load_faiss_index(index_file="faiss_index.bin"):
    """Load FAISS index."""
    index = faiss.read_index(index_file)
    print(f"✅ Loaded FAISS index with {index.ntotal} embeddings")
    return index

def load_text_chunks(text_file="text_chunks.pkl"):
    """Load text chunks."""
    with open(text_file, "rb") as f:
        text_chunks = pickle.load(f)
    print(f"✅ Loaded {len(text_chunks)} text chunks")
    return text_chunks

# ------------------------------
# 2️⃣ Retrieve Relevant Chunks
# ------------------------------
def retrieve_top_k(query, index, text_chunks, k=3):
    """Retrieve top-K similar text chunks."""
    embed_model = SentenceTransformer("BAAI/bge-base-en")
    query_embedding = np.array(embed_model.encode([query])).astype("float32")

    # Search FAISS
    distances, indices = index.search(query_embedding, k)

    # Retrieve text
    retrieved_texts = [text_chunks[i] for i in indices[0]]
    print(f"✅ Retrieved {k} relevant text chunks")
    return retrieved_texts

# ------------------------------
# 3️⃣ Generate Answer with Mistral
# ------------------------------
def generate_answer(query, retrieved_context):
    """Generate an answer using Mistral."""
    prompt = f"Based on the following documents:\n{retrieved_context}\nAnswer the query: {query}"
    llm = OllamaLLM(model="mistral")
    return llm.invoke(prompt)

# ------------------------------
# 4️⃣ Main Execution
# ------------------------------
if __name__ == "__main__":
    index = load_faiss_index()
    text_chunks = load_text_chunks()

    query = input("\n❓ Enter your question: ")
    retrieved_context = retrieve_top_k(query, index, text_chunks, k=3)
    answer = generate_answer(query, retrieved_context)

    print("\n🤖 Mistral's Answer:\n", answer)
