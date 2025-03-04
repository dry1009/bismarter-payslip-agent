
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

// Get or set user name
export function getUserName(): string | null {
  return localStorage.getItem("chatUserName");
}

export function setUserName(name: string): void {
  localStorage.setItem("chatUserName", name);
}

// Generate a unique conversation ID or retrieve from localStorage
export function getConversationId(): string {
  let conversationId = localStorage.getItem("chatConversationId");
  
  if (!conversationId) {
    conversationId = uuidv4();
    localStorage.setItem("chatConversationId", conversationId);
  }
  
  return conversationId;
}

// Check if this is the first visit
export function isFirstVisit(): boolean {
  return localStorage.getItem("chatUserName") === null;
}

// Reset conversation (for starting fresh)
export function resetConversation(): void {
  localStorage.removeItem("chatConversationId");
  localStorage.removeItem("chatHistory");
  // Don't remove the username when resetting conversation
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
    // Add user message to history with the correct type for role
    const updatedHistory: Message[] = [
      ...history,
      { role: "user" as const, content: userMessage, timestamp: new Date() }
    ];
    
    // Get conversation ID
    const conversationId = getConversationId();
    
    // Format messages for API
    const apiMessages = formatMessagesForApi(updatedHistory);

    // Get user name
    const userName = getUserName();
    
    // Create metadata object for the API request
    const metadata = userName ? { user_name: userName } : {};

    const body = {
      chatbotId: CHATBOT_ID,
      conversationId: conversationId,
      stream: false,
      messages: apiMessages,
      metadata: metadata
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
