# Chatbot IA com RAG

Este projeto é um chatbot inteligente construído com Flask e integrado à API da Groq. Além de responder mensagens de forma natural, ele também permite enviar documentos e responder perguntas com base no conteúdo carregado, usando uma abordagem simples de RAG.

## Conteúdo
- [Objetivo](#objetivo-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como rodar o sistema](#como-rodar-o-sistema)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Conclusão](#conclusão)

## Objetivo do projeto
O objetivo deste projeto é oferecer uma interface simples e intuitiva para conversar com uma IA generativa, com a possibilidade de carregar documentos e obter respostas baseadas no conteúdo desses arquivos.

## Funcionalidades
- Conversa com o modelo da Groq.
- Recomeço de conversa com o botão “Novo chat”.
- Upload de documentos em texto, Markdown, CSV, JSON, PDF e Word (.docx).
- Respostas com base no conteúdo do documento carregado, usando uma lógica básica de RAG.
- Interface responsiva com barra de entrada otimizada para chat.

## Estrutura do projeto

```text
ChatBot/
│
├── app.py
├── requirements.txt
├── README.md
│
├── chatbot_core/
│   ├── chatbot.py
│   ├── groq_client.py
│   └── rag.py
│
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

### app.py
Servidor Flask que expõe as rotas de conversa e upload de arquivos.

### chatbot_core/
Contém a lógica do chatbot, integração com a Groq e o mecanismo simples de RAG.

### frontend/
Interface visual do chat, incluindo envio de mensagens e upload de arquivos.

## Como rodar o sistema

1. Crie e ative um ambiente virtual:

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Instale as dependências:

```bash
pip install -r requirements.txt
```

3. Crie um arquivo `.env` com sua chave da Groq:

```bash
GROQ_API_KEY=SUA_CHAVE_AQUI
```

4. Inicie o servidor:

```bash
python app.py
```

5. Acesse no navegador:

```text
http://127.0.0.1:5000
```

## Tecnologias utilizadas
- Python
- Flask
- Flask-CORS
- Groq API
- python-dotenv
- PyPDF2
- python-docx
- HTML5
- CSS3
- JavaScript

## Conclusão
Este projeto mostra como transformar uma ideia simples em uma aplicação de chat com IA, adicionando recursos como recomeço de conversa e uso de documentos para enriquecer as respostas. Ele serve como base para evoluir para soluções mais completas de RAG e automação com IA.
