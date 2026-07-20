const input = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const messagesDiv = document.getElementById("messages");
let conversationId = 0;

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("msg", sender);
    div.textContent = text;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function setLoading(isLoading) {
    sendBtn.disabled = isLoading;
    input.disabled = isLoading;
    if (isLoading) {
        sendBtn.textContent = "Enviando...";
    } else {
        sendBtn.textContent = "Enviar";
    }
}

function addSystemMessage(text) {
    addMessage(text, "system");
}

function resetConversation() {
    conversationId += 1;
    messagesDiv.innerHTML = "";
    input.value = "";
    addSystemMessage("Nova conversa iniciada. Pode começar a digitar.");
    input.focus();
    setLoading(false);
}

async function uploadDocument() {
    const file = fileInput.files[0];
    if (!file) {
        addSystemMessage("Selecione um arquivo antes de enviar.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadBtn.disabled = true;
    uploadBtn.textContent = "Enviando...";

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            addSystemMessage(data.error || "Falha ao enviar o arquivo.");
        } else {
            addSystemMessage(`Documento carregado: ${data.filename}. Agora você pode perguntar sobre ele.`);
        }
    } catch (error) {
        addSystemMessage("Erro ao enviar o arquivo. Tente novamente.");
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = "Enviar arquivo";
        fileInput.value = "";
    }
}

async function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;

    const currentConversationId = conversationId;
    addMessage(msg, "user");
    input.value = "";
    setLoading(true);

    let response;
    try {
        response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        });
    } catch (error) {
        if (currentConversationId !== conversationId) return;
        setLoading(false);
        addSystemMessage("Erro de rede. Tente novamente.");
        return;
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        if (currentConversationId !== conversationId) return;
        setLoading(false);
        addSystemMessage("Resposta invalida do servidor.");
        return;
    }

    if (currentConversationId !== conversationId) return;

    if (!response.ok) {
        setLoading(false);
        addSystemMessage(data.error || "Falha ao gerar resposta.");
        return;
    }

    addMessage(data.response, "bot");
    setLoading(false);
}

sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", resetConversation);
uploadBtn.addEventListener("click", uploadDocument);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
