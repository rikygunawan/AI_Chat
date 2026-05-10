import { useState, useEffect, useRef } from "react"
import ChatbotIcon from "./components/ChatbotIcon"
import ChatForm from "./components/ChatForm"
import ChatMessage from './components/ChatMessage'; 
import { companyInfo } from "./components/MusimmasInfo";
import ollama from 'ollama/browser'; 

const App = () => {
  const [ChatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef();

  useEffect(() => {
    const scrollDelay = setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    }, 100);
    return () => clearTimeout(scrollDelay);
  }, [ChatHistory]);

  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Berpikir..."),
        { role: "model", text },
      ]);
    };

    // Format pesan agar sesuai standar Ollama (user/assistant)
    const systemMessage = {
      role: "system",
      content: companyInfo 
    };
    
    const lastMessages = history.slice(-6).map(({ role, text }) => ({
      role: role === "model" ? "assistant" : "user",
      content: text,
    }));

    const finalMessages = [systemMessage, ...lastMessages];

    try {
      //Panggil Ollama Lokal (Set llama3 sesuai model)
      const response = await ollama.chat({
        model: 'llama3', 
        messages: finalMessages,
        options: {
        temperature: 0.6, // Semakin rendah semakin patuh pada instruksi sistem
        num_predict: 500, // Membatasi panjang jawaban agar tidak terlalu bertele-tele
        }
      });

      //Ambil respon langsung dari objek response
      const apiResponseText = response.message.content.trim();
      updateHistory(apiResponseText);

    } catch (error) {
      console.error("Gagal mendapat respon:", error);
      updateHistory("Maaf, AI lokal sedang tidak aktif. Pastikan Ollama sudah berjalan.");
    }
  }

  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">MAI (Offline)</h2>
          </div>
          <button className="material-symbols-outlined">keyboard_arrow_down</button>
        </div>

        <div className="chat-body" ref={chatBodyRef}>
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              MAI di sini <br/> Ada yang bisa saya bantu?
            </p>
          </div>
          {ChatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        
        <div className="chat-footer">
          <ChatForm ChatHistory={ChatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
        </div>
      </div>
    </div>
  )
}

export default App
