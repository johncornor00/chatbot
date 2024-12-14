import { createContext, useState, ReactNode, useEffect } from "react";
import { runChat, fetchChatHistory } from "../config/openai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  conversation_id: string;
  history: ChatMessage[];
}

interface ChatContextType {
  prevPrompts: string[];
  setPrevPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  onSent: (prompt?: string) => Promise<void>;
  setRecentPrompt: React.Dispatch<React.SetStateAction<string>>;
  recentPrompt: string;
  showResult: boolean;
  loading: boolean;
  resultData: string;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  newChat: () => void;
  conversationId: string | null;
  chatHistory: ChatMessage[];
  conversations: Conversation[];
  loadConversation: (conversation_id: string) => void;
}

export const Context = createContext<ChatContextType | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [prevPrompts, setPrevPrompts] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [recentPrompt, setRecentPrompt] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultData, setResultData] = useState<string>("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const uuid = localStorage.getItem("uuid") || "";

  const loadChatHistory = async () => {
    try {
        const response = await fetchChatHistory(uuid);
        if (response.chat_history?.length > 0) {
            setConversations([...response.chat_history]); // Ensure immutability
            const latestConversation = response.chat_history[0];
            setConversationId(latestConversation.conversation_id);
            setChatHistory([...latestConversation.history]); // Ensure immutability
        } else {
            setConversations([]);
            setConversationId(null);
            setChatHistory([]);
        }
    } catch (error) {
        console.error("Error loading chat history:", error);
        setConversations([]);
        setConversationId(null);
        setChatHistory([]);
    }
};



const loadConversation = (conversation_id: string) => {
    const selectedConversation = conversations.find(
        (c) => c.conversation_id === conversation_id
    );
    if (selectedConversation) {
        setConversationId(conversation_id);
        setChatHistory([...selectedConversation.history]); // Ensure immutability
    } else {
        console.error(`Conversation with ID ${conversation_id} not found.`);
    }
};


  useEffect(() => {
    if (uuid) {
        loadChatHistory(); 
    } else {
        console.error("UUID is not available in localStorage.");
    }
}, [uuid]);


  const onSent = async (prompt?: string) => {
    if (!uuid) {
      console.error("UUID is missing. Cannot send messages.");
      return;
    }

    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      const currentPrompt = prompt ?? input;

      setChatHistory((prev) => [...prev, { role: "user", content: currentPrompt }]);
      const response = await runChat(currentPrompt, conversationId, uuid);

      if (response?.conversation_id) {
        setConversationId(response.conversation_id);

        setConversations((prev) => {
          const existingConversation = prev.find(
            (convo) => convo.conversation_id === response.conversation_id
          );
          if (existingConversation) {
            existingConversation.history = [...chatHistory];
            return [...prev];
          } else {
            return [
              ...prev,
              {
                conversation_id: response.conversation_id,
                history: [...chatHistory],
              },
            ];
          }
        });
      }

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: response.response || "" },
      ]);
    } catch (error) {
      console.error("Error in onSent:", error);
    }

    setLoading(false);
    setInput("");
  };

  const newChat = () => {
    setConversationId(null);
    setChatHistory([]);
    setShowResult(false);
    setResultData("");
  };

  const contextValue: ChatContextType = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    conversationId,
    chatHistory,
    conversations,
    loadConversation,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
