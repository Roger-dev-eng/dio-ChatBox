import unittest

from chatbot_core.rag import DocumentKnowledgeBase


class DocumentKnowledgeBaseTests(unittest.TestCase):
    def test_search_returns_relevant_chunks_for_query(self):
        kb = DocumentKnowledgeBase()
        kb.add_document(
            "manual.txt",
            "A política de reembolso permite devolução em até 30 dias. O processo começa no portal do cliente."
        )

        chunks = kb.search("reembolso", top_k=3)

        self.assertTrue(chunks)
        self.assertTrue(any("reembolso" in chunk.lower() for chunk in chunks))


if __name__ == "__main__":
    unittest.main()
