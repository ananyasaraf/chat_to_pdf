import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        return f"An error occurred: {e}"

# Example usage
if __name__ == "__main__":
    input_pdf = "a.pdf" 
    extracted_text = extract_text_from_pdf(input_pdf)
    
    # Save to a text file or print
    with open("extracted_text.txt", "w", encoding="utf-8") as f:
        f.write(extracted_text)
    
    print("✅ Text extracted and saved to extracted_text.txt")
