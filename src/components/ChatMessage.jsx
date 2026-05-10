import ChatbotIcon from "./ChatbotIcon"
import { useRef } from "react";

const ChatMessage = ({chat}) => {
    return(
        !chat.hideInChat && (
        <div className= {`message ${chat.role === "model" ? 'bot' : 'user'}-message`}>
        {chat.role === "model" && <ChatbotIcon />}
        <p className="message-text">{chat.text}</p>
        </div>
       )
    );
};

export default ChatMessage