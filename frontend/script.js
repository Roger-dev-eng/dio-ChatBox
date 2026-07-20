const input = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
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

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
