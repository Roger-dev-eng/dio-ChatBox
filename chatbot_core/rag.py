import re
from typing import List


class DocumentKnowledgeBase:
    def __init__(self):
        self.documents: dict[str, str] = {}

    def add_document(self, filename: str, content: str) -> None:
        self.documents[filename] = content.strip()

    def _chunk_document(self, content: str) -> List[str]:
        paragraphs = [part.strip() for part in re.split(r"\n\s*\n", content) if part.strip()]
        chunks: List[str] = []
        current = ""
        for paragraph in paragraphs:
            if len(current) + len(paragraph) <= 600:
                current = f"{current}\n{paragraph}".strip()
            else:
                if current:
                    chunks.append(current)
                current = paragraph
        if current:
            chunks.append(current)
        return chunks

    def search(self, query: str, top_k: int = 3) -> List[str]:
        if not self.documents:
            return []

        normalized_query = query.lower()
        ranked = []
        for filename, content in self.documents.items():
            chunks = self._chunk_document(content)
            for chunk in chunks:
                score = 0
                if normalized_query in chunk.lower():
                    score += 5
                for word in normalized_query.split():
                    if word in chunk.lower():
                        score += 1
                if score > 0:
                    ranked.append((score, filename, chunk))

        ranked.sort(key=lambda item: item[0], reverse=True)
        results = []
        for _, _, chunk in ranked[:top_k]:
            if chunk:
                results.append(chunk)
        return results

    def get_context(self, query: str, top_k: int = 3) -> str:
        chunks = self.search(query, top_k=top_k)
        if not chunks:
            return ""
        return "\n\n".join(chunks)
