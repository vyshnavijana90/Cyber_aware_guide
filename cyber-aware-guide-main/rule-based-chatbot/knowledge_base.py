"""
Knowledge Base for Sophia - The Rule-Based AI Chatbot.
Contains regex patterns and responses for both general intents and 15 tech topics.
"""

# General chatbot conversational intents
INTENTS = [
    {
        "intent": "greeting",
        "patterns": [
            r"\bhi\b",
            r"\bhello\b",
            r"\bhey\b",
            r"\bgood\s+morning\b",
            r"\bgood\s+evening\b",
            r"\bgood\s+afternoon\b"
        ],
        "responses": [
            "Hello! I am Sophia, your AI learning assistant. How can I help you today?",
            "Hi there! What can I do for you today?",
            "Hey! Hope you are having a wonderful day. How can I assist you?",
            "Good day! What technology topic would you like to explore today?"
        ]
    },
    {
        "intent": "small_talk",
        "patterns": [
            r"\bhow\s+are\s+you\b",
            r"\bhow\s+is\s+it\s+going\b",
            r"\bhow\s+are\s+things\b",
            r"\bhow\s+do\s+you\s+do\b"
        ],
        "responses": [
            "I'm just a collection of Python code, but I'm running at 100% efficiency! How about you?",
            "I'm doing great, thank you! Ready to answer your tech questions. What's on your mind?",
            "I'm feeling smart today! Let's talk about Python, AI, or cybersecurity."
        ]
    },
    {
        "intent": "bot_identity",
        "patterns": [
            r"\bwhat\s+is\s+your\s+name\b",
            r"\bwho\s+are\s+you\b",
            r"\byour\s+name\b"
        ],
        "responses": [
            "I am Sophia, a rule-based AI chatbot designed using Python and pattern matching!",
            "My name is Sophia. I'm your friendly IT and Computer Science reference guide.",
            "You're talking to Sophia! I can explain concepts like OOP, Cloud Computing, Git, and more."
        ]
    },
    {
        "intent": "thank_you",
        "patterns": [
            r"\bthank(s|\s+you)\b",
            r"\bthank\s+you\s+very\s+much\b",
            r"\bappreciate\s+it\b"
        ],
        "responses": [
            "You are very welcome! Let me know if you need anything else.",
            "Glad I could help! Happy learning!",
            "Anytime! I'm here to make tech concepts easier to understand.",
            "My pleasure! Feel free to ask more questions."
        ]
    },
    {
        "intent": "exit",
        "patterns": [
            r"\bbye\b",
            r"\bexit\b",
            r"\bquit\b",
            r"\bsee\s+you\b",
            r"\bterminate\b"
        ],
        "responses": [
            "Goodbye! Have a great day ahead and keep coding!",
            "Bye! Happy learning and see you soon!",
            "Farewell! Feel free to run me again when you want to learn more.",
            "See you later! Take care!"
        ]
    }
]

# 15 Domain-specific Technical Q&As
KNOWLEDGE_BASE = [
    {
        "topic": "Artificial Intelligence",
        "patterns": [
            r"\b(artificial\s+intelligence|ai)\b"
        ],
        "question": "What is Artificial Intelligence (AI)?",
        "answer": "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think, learn, and perform tasks that typically require human intellect, such as visual perception, decision-making, and translation."
    },
    {
        "topic": "Python",
        "patterns": [
            r"\bpython\b"
        ],
        "question": "Why is Python so popular?",
        "answer": "Python is popular because of its clean, highly readable syntax, ease of learning, a vast ecosystem of standard and third-party libraries (like NumPy, Pandas, TensorFlow), strong community support, and versatility in fields like web development, data science, automation, and AI."
    },
    {
        "topic": "Machine Learning",
        "patterns": [
            r"\b(machine\s+learning|ml)\b"
        ],
        "question": "What is Machine Learning?",
        "answer": "Machine Learning (ML) is a subset of Artificial Intelligence focused on building systems that learn from data and improve their performance over time without being explicitly programmed for a specific task."
    },
    {
        "topic": "Data Science",
        "patterns": [
            r"\bdata\s+science\b"
        ],
        "question": "What is Data Science?",
        "answer": "Data Science is an interdisciplinary field that combines domain expertise, programming skills (often Python or R), and mathematical and statistical knowledge to extract meaningful, actionable insights from raw structured and unstructured data."
    },
    {
        "topic": "Chatbots",
        "patterns": [
            r"\bchatbot(s)?\b"
        ],
        "question": "How do chatbots work?",
        "answer": "Chatbots work by taking user input and analyzing it using either rules (pattern matching using regular expressions, like me!) or natural language processing (NLP) models to map inputs to intent and retrieve or generate appropriate responses."
    },
    {
        "topic": "Deep Learning",
        "patterns": [
            r"\b(deep\s+learning|dl)\b"
        ],
        "question": "What is Deep Learning?",
        "answer": "Deep Learning is a specialized subfield of Machine Learning based on Artificial Neural Networks with multiple layers (hence 'deep'). It is exceptionally good at finding complex patterns in raw data, such as images, audio, and large-scale text."
    },
    {
        "topic": "Natural Language Processing",
        "patterns": [
            r"\b(natural\s+language\s+processing|nlp)\b"
        ],
        "question": "What is Natural Language Processing (NLP)?",
        "answer": "Natural Language Processing (NLP) is a branch of AI that enables computers to understand, interpret, manipulate, and generate human languages, powering features like translation, sentiment analysis, and search engines."
    },
    {
        "topic": "Computer Vision",
        "patterns": [
            r"\b(computer\s+vision|cv)\b"
        ],
        "question": "What is Computer Vision?",
        "answer": "Computer Vision is a field of AI that trains computers to interpret and understand the visual world. It allows machines to accurately identify and process objects in digital images, videos, and real-time feeds."
    },
    {
        "topic": "Object-Oriented Programming",
        "patterns": [
            r"\b(object\s+oriented\s+programming|oop)\b"
        ],
        "question": "What is Object-Oriented Programming (OOP)?",
        "answer": "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of 'objects' containing data (attributes) and code (methods). The four core pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction."
    },
    {
        "topic": "SQL",
        "patterns": [
            r"\bsql\b"
        ],
        "question": "What is SQL and why is it used?",
        "answer": "Structured Query Language (SQL) is a standardized programming language used to manage, store, query, update, and manipulate data stored in Relational Database Management Systems (RDBMS) like MySQL, PostgreSQL, and SQLite."
    },
    {
        "topic": "Cloud Computing",
        "patterns": [
            r"\bcloud\s+computing\b"
        ],
        "question": "What is Cloud Computing?",
        "answer": "Cloud Computing is the on-demand delivery of IT resources (including servers, storage, databases, networking, and software) over the internet with pay-as-you-go pricing, replacing physical on-premise data centers."
    },
    {
        "topic": "APIs",
        "patterns": [
            r"\b(api|apis)\b"
        ],
        "question": "What is an API?",
        "answer": "An API (Application Programming Interface) is a set of defined rules and protocols that allows different software applications to communicate and exchange data with each other (e.g., retrieving weather data to show on a website)."
    },
    {
        "topic": "Git",
        "patterns": [
            r"\bgit\b"
        ],
        "question": "What is Git and why is it important?",
        "answer": "Git is a free, open-source distributed version control system designed to track changes in source code during software development. It allows multiple developers to collaborate smoothly, manage branches, and roll back changes if needed."
    },
    {
        "topic": "Data Analytics",
        "patterns": [
            r"\bdata\s+analytics\b"
        ],
        "question": "What is Data Analytics?",
        "answer": "Data Analytics is the process of cleaning, transforming, and modeling raw data to discover useful trends, draw conclusions, and support strategic decision-making in businesses and organizations."
    },
    {
        "topic": "Cyber Security",
        "patterns": [
            r"\b(cyber\s*security|information\s*security)\b"
        ],
        "question": "What is Cyber Security?",
        "answer": "Cybersecurity is the practice of protecting systems, networks, devices, programs, and sensitive data from digital attacks, theft, damage, unauthorized access, or disruption."
    }
]
