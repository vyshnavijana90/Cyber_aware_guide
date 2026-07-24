# Rule-Based Conversational AI Chatbot using Pattern Matching

A lightweight, interactive, console-based chatbot project written in Python. It utilizes regular expressions (`re` module) for intent classification and knowledge retrieval. The chatbot, named **Sophia**, is capable of answering technical questions across 15 different domains (like AI, OOP, SQL, Git, and Cybersecurity) in addition to managing casual small talk and greetings. 

This project is modular, beginner-friendly, clean-coded, and makes an excellent submission for college mini-projects.

---

## Features

1. **Rule-Based Intent Recognition**: Categorizes casual conversation inputs like greetings, farewells, gratitude, identity queries, and help commands.
2. **Domain-Specific Knowledge Base**: Contains answers to questions spanning **15 core technical domains**:
   - Artificial Intelligence (AI)
   - Python Programming
   - Machine Learning (ML)
   - Data Science
   - Chatbots
   - Deep Learning (DL)
   - Natural Language Processing (NLP)
   - Computer Vision (CV)
   - Object-Oriented Programming (OOP)
   - SQL & Relational Databases
   - Cloud Computing
   - APIs (Application Programming Interfaces)
   - Git (Version Control)
   - Data Analytics
   - Cyber Security
3. **Regex Pattern Matching**: Preprocesses user queries (lowercasing, punctuation removal) and performs keyword searches with word boundaries using Python's `re` module.
4. **Conversation Logging**: Automatically generates and appends every session's conversation (User message, Bot response, Date & Time stamp) to `chat_history.txt`.
5. **Typing Animation**: Simulates human typing in real-time by rendering text character-by-character using the `time` module.
6. **Colored Console Interface**: Dynamically styles chatbot elements (prompts, errors, bot replies, system texts) in various terminal colors using `colorama`.
7. **Input Validation & Safety**: Gracefully handles empty messages, keyboard interrupts (`Ctrl+C`), and EOF signals (`Ctrl+D`).

---

## Folder Structure

```text
rule-based-chatbot/
│
├── chatbot.py            # Main application loop, matching logic, and console UI
├── knowledge_base.py     # Contains patterns and response dictionaries (modularized data)
├── requirements.txt      # Project library dependencies (colorama)
├── README.md             # Project documentation (this file)
└── chat_history.txt      # Generated automatically at runtime to log conversations
```

---

## Technologies Used

- **Python 3.x**: Core programming language.
- **Regular Expressions (`re`)**: Built-in library for input processing and pattern matching.
- **Colorama**: Library for styling and coloring the terminal outputs.
- **Time & Sys**: Built-in modules used for implementing typing animation.
- **Datetime**: Built-in module used for generating session logs.

---

## Installation Steps

1. Make sure you have **Python 3** installed on your system. You can verify it by running:
   ```bash
   python --version
   ```
2. Navigate to the project directory:
   ```bash
   cd rule-based-chatbot
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## How to Run

Launch the chatbot by running:
```bash
python chatbot.py
```

---

## Sample Conversation

```text
============================================================
            Sophia - Rule-Based Tech Chatbot            
============================================================
Hello! I am Sophia, your technical reference companion.
I can answer questions on 15 domains including:
AI, Python, ML, OOP, SQL, Git, Cybersecurity, and more.
Type 'help' at any time to list all topics.
Type 'exit', 'quit', or 'bye' to end our chat.
============================================================

You: hello
Sophia: Hey! Hope you are having a wonderful day. How can I assist you?

You: what is python?
Sophia: Python is popular because of its clean, highly readable syntax, ease of learning, a vast ecosystem of standard and third-party libraries (like NumPy, Pandas, TensorFlow), strong community support, and versatility in fields like web development, data science, automation, and AI.

You: explain oop
Sophia: Object-Oriented Programming (OOP) is a programming paradigm based on the concept of 'objects' containing data (attributes) and code (methods). The four core pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction.

You: help
Sophia: I can help you with basic small talk and answer questions on various IT and AI topics.
Here are the topics you can ask me about:
1. Artificial Intelligence (AI)
2. Python
3. Machine Learning (ML)
4. Data Science
5. Chatbots
6. Deep Learning (DL)
...

You: asdfghjkl
Sophia: Sorry, I don't understand that. Type 'help' to see what I can answer.

You: bye
Sophia: Goodbye! Have a great day ahead and keep coding!

Session closed. Logs saved to chat_history.txt.
```

---

## Future Enhancements

- **Synonym Dictionary**: Incorporate a thesaurus mapping to resolve synonyms (e.g., matching "explain" or "tell me about" to definition queries).
- **GUI Integration**: Wrap the chatbot logic with a graphical interface using libraries like Tkinter, CustomTkinter, or PyQt.
- **SQL Database Logging**: Transition conversation logs from a flat text file (`chat_history.txt`) to a local SQLite database for structured querying.
- **Web App Interface**: Deploy the chatbot on a web UI using Streamlit or Flask.
