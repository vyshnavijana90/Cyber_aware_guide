"""
Sophia: A Rule-Based Conversational AI Chatbot using Pattern Matching.

This script implements an interactive console chatbot that uses regular expressions
to match user inputs to conversational intents and a tech-domain knowledge base.
It logs conversations with timestamps to 'chat_history.txt', features typewriter
typing effects, and styles output with colored terminal text.

Author: Antigravity AI
"""

import datetime
import os
import random
import re
import sys
import time

try:
    import colorama
    from colorama import Fore, Style
    colorama.init(autoreset=True)
    COLOR_SUPPORT = True
except ImportError:
    COLOR_SUPPORT = False


# Import the rules and knowledge base
try:
    from knowledge_base import INTENTS, KNOWLEDGE_BASE
except ImportError:
    print("Error: Could not import 'knowledge_base.py'. Ensure it is in the same directory.")
    sys.exit(1)


# Path to the chat history file
HISTORY_FILE_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "chat_history.txt"
)


def type_print(text: str, prefix: str = "", color_prefix: str = "", color_text: str = ""):
    """
    Prints text mimicking a typing effect.
    
    Args:
        text (str): The main response message.
        prefix (str): Label before the message (e.g., 'Sophia: ').
        color_prefix (str): Colorama style code for the prefix.
        color_text (str): Colorama style code for the text.
    """
    # Print the prefix if provided
    if prefix:
        if COLOR_SUPPORT:
            sys.stdout.write(color_prefix + prefix + Style.RESET_ALL)
        else:
            sys.stdout.write(prefix)
        sys.stdout.flush()

    # Apply text color
    if COLOR_SUPPORT and color_text:
        sys.stdout.write(color_text)

    # Print character-by-character with slight delay
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(0.01)

    # Reset styling and add a newline
    if COLOR_SUPPORT:
        sys.stdout.write(Style.RESET_ALL + "\n")
    else:
        sys.stdout.write("\n")
    sys.stdout.flush()


def log_conversation(event_type: str, user_msg: str = "", bot_msg: str = ""):
    """
    Appends conversation logs to chat_history.txt with date and time.
    
    Args:
        event_type (str): Type of logging event ('START', 'END', 'CHAT').
        user_msg (str): Message from the user.
        bot_msg (str): Message from the chatbot.
    """
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        with open(HISTORY_FILE_PATH, "a", encoding="utf-8") as f:
            if event_type == "START":
                f.write(f"{'-'*50}\nSession Started: {timestamp}\n{'-'*50}\n")
            elif event_type == "END":
                f.write(f"Session Ended: {timestamp}\n{'-'*50}\n\n")
            elif event_type == "CHAT":
                f.write(f"[{timestamp}] User: {user_msg}\n")
                f.write(f"[{timestamp}] Sophia: {bot_msg}\n")
    except IOError as e:
        # Silently fail or output to stderr if writing fails
        sys.stderr.write(f"Logging error: {e}\n")


def preprocess_input(user_input: str) -> str:
    """
    Cleans and preprocesses the user input for pattern matching.
    
    Args:
        user_input (str): Raw string entered by the user.
        
    Returns:
        str: Lowercased, stripped, and cleaned string.
    """
    cleaned = user_input.strip().lower()
    # Remove basic trailing punctuation (like ?, !, .) that might interfere with word boundaries
    cleaned = re.sub(r"[?!.]+$", "", cleaned)
    return cleaned


def find_response(user_input: str) -> tuple[str, bool]:
    """
    Matches the user input against regular expressions in the knowledge base and intents.
    
    Args:
        user_input (str): Preprocessed user message.
        
    Returns:
        tuple[str, bool]: (response_text, is_exit_flag)
    """
    # 1. Check exit intent first
    for intent_data in INTENTS:
        if intent_data["intent"] == "exit":
            for pattern in intent_data["patterns"]:
                if re.search(pattern, user_input):
                    return random.choice(intent_data["responses"]), True

    # 2. Check general conversational intents
    for intent_data in INTENTS:
        if intent_data["intent"] != "exit":
            for pattern in intent_data["patterns"]:
                if re.search(pattern, user_input):
                    return random.choice(intent_data["responses"]), False

    # 3. Check domain-specific knowledge base
    for topic_data in KNOWLEDGE_BASE:
        for pattern in topic_data["patterns"]:
            if re.search(pattern, user_input):
                return topic_data["answer"], False

    # 4. Fallback message if no match is found
    fallback = "Sorry, I don't understand that. Type 'help' to see what I can answer."
    return fallback, False


def print_welcome_banner():
    """Prints a beautiful colored header for the chatbot console."""
    cyan = Fore.CYAN if COLOR_SUPPORT else ""
    yellow = Fore.YELLOW if COLOR_SUPPORT else ""
    reset = Style.RESET_ALL if COLOR_SUPPORT else ""
    
    print(cyan + "="*60)
    print(cyan + " "*12 + "Sophia - Rule-Based Tech Chatbot" + reset)
    print(cyan + "="*60)
    print(yellow + "Hello! I am Sophia, your technical reference companion.")
    print(yellow + "I can answer questions on 15 domains including:")
    print(yellow + "AI, Python, ML, OOP, SQL, Git, Cybersecurity, and more.")
    print(yellow + "Type 'help' at any time to list all topics.")
    print(yellow + "Type 'exit', 'quit', or 'bye' to end our chat.")
    print(cyan + "="*60 + reset)


def main():
    """Main execution loop for the chatbot."""
    # Pre-populate history file with starting boundary
    log_conversation("START")
    print_welcome_banner()

    # Colors configuration
    cyan = Fore.CYAN if COLOR_SUPPORT else ""
    green = Fore.GREEN if COLOR_SUPPORT else ""
    magenta = Fore.MAGENTA if COLOR_SUPPORT else ""
    red = Fore.RED if COLOR_SUPPORT else ""
    reset = Style.RESET_ALL if COLOR_SUPPORT else ""

    try:
        while True:
            # Get user input
            try:
                # Magenta prompt for user
                prompt_str = f"{magenta}You: {reset}" if COLOR_SUPPORT else "You: "
                user_raw = input(prompt_str)
            except EOFError:
                # Handle Ctrl+D or end of file gracefully
                print()
                farewell = "Goodbye! Session terminated."
                type_print(farewell, prefix="Sophia: ", color_prefix=cyan, color_text=green)
                log_conversation("CHAT", "[EOF]", farewell)
                break

            # Validate input
            if not user_raw.strip():
                # Display warning in Red
                type_print(
                    "Input cannot be empty. Please type a message or ask a question!",
                    prefix="Sophia: ",
                    color_prefix=cyan,
                    color_text=red
                )
                continue

            # Process input
            cleaned_input = preprocess_input(user_raw)
            
            # Find matching response
            response, is_exit = find_response(cleaned_input)

            # Print bot response with typing animation
            type_print(response, prefix="Sophia: ", color_prefix=cyan, color_text=green)

            # Log the message exchange
            log_conversation("CHAT", user_raw, response)

            # Terminate loop if exit intent was matched
            if is_exit:
                break

    except KeyboardInterrupt:
        # Handle Ctrl+C gracefully
        print()
        farewell = "Chat session interrupted. Goodbye!"
        type_print(farewell, prefix="Sophia: ", color_prefix=cyan, color_text=red)
        log_conversation("CHAT", "[CTRL+C]", farewell)

    finally:
        # Close the history session log
        log_conversation("END")
        print(cyan + "\nSession closed. Logs saved to chat_history.txt." + reset)


if __name__ == "__main__":
    main()
