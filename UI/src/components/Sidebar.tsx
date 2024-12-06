import React, { useContext, useState } from "react";
import "../styles/Sidebar.scss";
import { assets } from "../assets/assets";
import { Context } from "../context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const context = useContext(Context);

  if (!context) {
    return null;
  }

  const { conversations, newChat, loadConversation } = context;

  return (
    <div className={`sidebar ${extended ? "extended" : ""}`}>
      <div className="top">
        <img
          src={assets.menu_icon}
          alt="Menu"
          className="menu"
          onClick={() => setExtended((prev) => !prev)}
        />
        <div onClick={newChat} className={`new-chat ${extended ? "extended" : ""}`}>
          <img src={assets.plus_icon} alt="New Chat" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {conversations.length > 0 ? (
            <div className={`recent ${extended ? "extended" : ""}`}>
                <p className="recent-title">Conversations</p>
                {conversations.map((conversation) => (
                    <div
                        key={conversation.conversation_id}
                        onClick={() => loadConversation(conversation.conversation_id)}
                        className="recent-entry"
                    >
                        <img src={assets.message_icon} alt="Message Icon" />
                        <p>
                            {conversation.history[0]?.content.slice(0, 15) + "..." || "New Chat"}
                        </p>
                    </div>
                ))}
            </div>
        ) : (
            <p className="no-conversations">No conversations found</p>
        )}

      </div>
    </div>
  );
};

export default Sidebar;
