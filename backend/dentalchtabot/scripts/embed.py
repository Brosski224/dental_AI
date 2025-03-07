import os
import pickle
import numpy as np
from tqdm import tqdm
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer

# ------------------------------
# 1️⃣ Extract Text from Multiple PDFs
# ------------------------------
def extract_text_from_pdfs(pdf_folder):
    """Extract text from all PDFs in a folder."""
    text_chunks = []
    
    for pdf_file in tqdm(os.listdir(pdf_folder), desc="📄 Processing PDFs"):
        if pdf_file.endswith(".pdf"):
            pdf_path = os.path.join(pdf_folder, pdf_file)
            pdf_reader = PdfReader(pdf_path)

            for page in pdf_reader.pages:
                text_chunks.append(page.extract_text())

    print(f"✅ Extracted {len(text_chunks)} text chunks from {len(os.listdir(pdf_folder))} PDFs")
    return text_chunks

# ------------------------------
# 2️⃣ Generate Embeddings
# ------------------------------
def generate_embeddings(text_chunks, model_name="BAAI/bge-base-en"):
    """Generate embeddings using a local model."""
    embed_model = SentenceTransformer(model_name)
    embeddings = embed_model.encode(text_chunks, show_progress_bar=True)
    print(f"✅ Generated {len(embeddings)} embeddings")
    return embeddings

# ------------------------------
# 3️⃣ Save Data for FAISS
# ------------------------------
def save_data(text_chunks, embeddings, text_file="text_chunks.pkl", emb_file="embeddings.pkl"):
    """Save extracted text and embeddings."""
    with open(text_file, "wb") as f:
        pickle.dump(text_chunks, f)
    with open(emb_file, "wb") as f:
        pickle.dump(embeddings, f)
    print("✅ Text and embeddings saved!")

# ------------------------------
# 4️⃣ Main Execution
# ------------------------------
if __name__ == "__main__":
    PDF_FOLDER = "pdfs"  # Folder containing all PDFs

    # Extract text from all PDFs
    text_chunks = extract_text_from_pdfs(r"D:\Dental-Clinic-Management\backend\dentalchtabot\sources\resources")

    # Generate embeddings
    embeddings = generate_embeddings(text_chunks)

    # Save extracted text and embeddings
    save_data(text_chunks, embeddings)


