import pickle
import faiss
import numpy as np

# ------------------------------
# 1️⃣ Load Saved Data
# ------------------------------
def load_data(text_file="text_chunks.pkl", emb_file="embeddings.pkl"):
    """Load saved text chunks and embeddings."""
    with open(text_file, "rb") as f:
        text_chunks = pickle.load(f)
    with open(emb_file, "rb") as f:
        embeddings = pickle.load(f)

    print(f"✅ Loaded {len(text_chunks)} text chunks and {len(embeddings)} embeddings")
    return text_chunks, np.array(embeddings).astype("float32")

# ------------------------------
# 2️⃣ Store in FAISS
# ------------------------------
def store_in_faiss(embeddings, index_file="faiss_index.bin"):
    """Store embeddings in FAISS."""
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)

    # Save index
    faiss.write_index(index, index_file)
    print(f"✅ Stored {index.ntotal} embeddings in FAISS")

# ------------------------------
# 3️⃣ Main Execution
# ------------------------------
if __name__ == "__main__":
    text_chunks, embeddings = load_data()
    store_in_faiss(embeddings)
