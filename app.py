from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot_core.chatbot import Chatbot
from chatbot_core.rag import DocumentKnowledgeBase
import logging
import os
import time
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder="frontend", static_url_path="")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
CORS(app)

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))

MAX_MESSAGE_LENGTH = int(os.getenv("MAX_MESSAGE_LENGTH", "1000"))

bot = Chatbot()
knowledge_base = DocumentKnowledgeBase()
bot.set_knowledge_base(knowledge_base)


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/api/upload", methods=["POST"])
def api_upload():
    file_storage = request.files.get("file")
    if not file_storage or file_storage.filename == "":
        return jsonify({"error": "Selecione um arquivo para enviar."}), 400

    filename = secure_filename(file_storage.filename)
    if not filename:
        return jsonify({"error": "Nome de arquivo inválido."}), 400

    allowed_extensions = (".txt", ".md", ".csv", ".json")
    if not filename.lower().endswith(allowed_extensions):
        return jsonify({"error": "Formato não suportado. Envie um arquivo .txt, .md, .csv ou .json."}), 400

    data = file_storage.read()
    if not data.strip():
        return jsonify({"error": "O arquivo está vazio."}), 400

    save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    with open(save_path, "wb") as handle:
        handle.write(data)

    content = data.decode("utf-8", errors="ignore")
    knowledge_base.add_document(filename, content)
    bot.set_knowledge_base(knowledge_base)

    return jsonify({"message": "Documento carregado com sucesso.", "filename": filename})


@app.route("/api/chat", methods=["POST"])
def api_chat():
    start = time.perf_counter()
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "Mensagem vazia."}), 400

    if len(message) > MAX_MESSAGE_LENGTH:
        return jsonify(
            {"error": f"Mensagem muito longa (max {MAX_MESSAGE_LENGTH} caracteres)."}
        ), 400

    try:
        response = bot.chat(message)
    except Exception:
        logging.exception("Erro ao chamar o LLM")
        duration_ms = int((time.perf_counter() - start) * 1000)
        logging.info("chat status=error duration_ms=%s length=%s", duration_ms, len(message))
        return jsonify({"error": "Falha ao gerar resposta."}), 502

    duration_ms = int((time.perf_counter() - start) * 1000)
    logging.info("chat status=ok duration_ms=%s length=%s", duration_ms, len(message))
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
