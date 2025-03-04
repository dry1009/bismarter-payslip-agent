
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

// API constants
const API_KEY = "3961acc7-db32-4be4-89fd-ddec1df3da47";
const CHATBOT_ID = "aS-hBVetFBBnqDa2V_pU8";
const API_URL = "https://www.chatbase.co/api/v1/chat";

// Store conversation history
let conversationHistory: { role: "user" | "assistant"; content: string }[] = [];

export async function sendMessage(userMessage: string): Promise<string> {
  try {
    // Add user message to conversation history
    conversationHistory.push({
      role: "user",
      content: userMessage
    });

    const body = {
      chatbotId: CHATBOT_ID,
      stream: false,
      messages: conversationHistory // Send the entire conversation history
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      toast.error("שגיאה בשליחת ההודעה");
      console.error("API error:", errorText);
      return "שגיאה: " + response.statusText;
    }

    const data = await response.json();
    
    // Add assistant response to conversation history
    conversationHistory.push({
      role: "assistant",
      content: data.text
    });
    
    return data.text;
  } catch (error) {
    toast.error("שגיאה בהתקשרות עם השרת");
    console.error("Error sending message:", error);
    return "שגיאה במהלך התקשורת: " + (error instanceof Error ? error.message : String(error));
  }
}

export function clearConversationHistory(): void {
  conversationHistory = [];
}

export function formatMessages(messages: Message[]): Message[] {
  return messages.map(message => ({
    ...message,
    content: message.content.trim()
  }));
}
