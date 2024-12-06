import axios from "axios";

export const runChat = async (prompt: string, conversationId: string | null, uuid: string) => {
  if (!uuid) {
    console.error("UUID is missing. Cannot send chat request.");
    return null;
  }

  console.log("Sending UUID to backend:", uuid);
  try {
    const response = await axios.post("http://localhost:8000/chat", {
      prompt,
      conversation_id: conversationId || null,
      uuid,
    });
    return response.data;
  } catch (error) {
    console.error("Error in runChat:", error);
    return null;
  }
};

export const fetchChatHistory = async (uuid: string) => {
  try {
      const response = await axios.get(`http://localhost:8000/history/${uuid}`);
      if (response.data?.chat_history) {
          return response.data;
      } else {
          console.warn("No chat history found in response.");
          return { chat_history: [] };
      }
  } catch (error) {
      console.error("Error fetching chat history:", error);
      return { chat_history: [] };
  }
};


