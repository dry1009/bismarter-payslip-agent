
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Message interface to match what we need for both UI and API
export interface Message {
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

// API constants
const API_KEY = "3961acc7-db32-4be4-89fd-ddec1df3da47";
const CHATBOT_ID = "aS-hBVetFBBnqDa2V_pU8";
const API_URL = "https://www.chatbase.co/api/v1/chat";

// Generate a unique conversation ID or retrieve from localStorage
export function getConversationId(): string {
  let conversationId = localStorage.getItem("chatConversationId");
  
  if (!conversationId) {
    conversationId = uuidv4();
    localStorage.setItem("chatConversationId", conversationId);
  }
  
  return conversationId;
}

// Reset conversation (for starting fresh)
export function resetConversation(): void {
  localStorage.removeItem("chatConversationId");
  localStorage.removeItem("chatHistory");
}

// Get stored chat history or initialize empty array
export function getChatHistory(): Message[] {
  const historyJson = localStorage.getItem("chatHistory");
  return historyJson ? JSON.parse(historyJson) : [];
}

// Save chat history to localStorage
export function saveChatHistory(messages: Message[]): void {
  localStorage.setItem("chatHistory", JSON.stringify(messages));
}

// Format messages for Chatbase API
function formatMessagesForApi(messages: Message[]): any[] {
  return messages.map(message => ({
    role: message.role === "user" ? "user" : "assistant",
    content: message.content
  }));
}

// Send message to Chatbase with full conversation history
export async function sendMessage(userMessage: string, history: Message[] = []): Promise<string> {
  try {
    // Add user message to history
    const updatedHistory = [
      ...history,
      { role: "user", content: userMessage, timestamp: new Date() }
    ];
    
    // Get conversation ID
    const conversationId = getConversationId();
    
    // Format messages for API
    const apiMessages = formatMessagesForApi(updatedHistory);

    const body = {
      chatbotId: CHATBOT_ID,
      conversationId: conversationId,
      stream: false,
      messages: apiMessages
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
    return data.text;
  } catch (error) {
    toast.error("שגיאה בהתקשרות עם השרת");
    console.error("Error sending message:", error);
    return "שגיאה במהלך התקשורת: " + (error instanceof Error ? error.message : String(error));
  }
}

// Helper function to clean message content
export function formatMessages(messages: Message[]): Message[] {
  return messages.map(message => ({
    ...message,
    content: message.content.trim()
  }));
}
