import { useState, useEffect, useRef } from "react"
import ChatbotIcon from "./components/ChatbotIcon"
import ChatForm from "./components/ChatForm"
import ChatMessage from './components/ChatMessage'; 
import {companyInfo}  from "./components/MusimmasInfo";


const App = () => {
  // ChatHistory Kosong, hanya untuk simpan percakapan user & bot
  const[ChatHistory,setChatHistory] = useState([]);

  // Fungsi auto-scroll setiap kali ChatHistory berubah
  const chatBodyRef = useRef();
  useEffect(() => {
    const scrollDelay = setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    }, 100); // Tunggu 100ms agar DOM selesai update
    return () => clearTimeout(scrollDelay);
  }, [ChatHistory]);

  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Berpikir..."),
        { role: "model", text },
      ]);
    };

  // Gemini AI FORMAT
  // const generateBotResponse = async (history) => {
  //   const updateHistory = (text) =>{
  //     setChatHistory((prev) =>[...prev.filter(msg => msg.text !=="Berpikir..."),{role: "model",text}])
  //   }

  //   // Format chat untuk request API
  //   history = history.map(({role, text}) => ({role, parts: [{text}]}))

  //   const requestOptions ={
  //     method: "POST",
  //     headers: { "Content-Type" : "application/json" },
  //     body: JSON.stringify({contents: history})
  //   }
    // try {
    //   // TAMBAHKAN API KEY DI SINI
    //   const urlWithKey = `${import.meta.env.VITE_GEMINI_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
    //   const response = await fetch(urlWithKey, requestOptions);
      
    //   const data = await response.json();

    //   // CEK STATUS SEBELUM PARSING JSON
    //   if (!response.ok) {
    //       const errorData = await response.json().catch(() => ({}));
    //       throw new Error(errorData.error?.message || `Error ${response.status}`);
    //   }

    //   const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    //   updateHistory(apiResponseText);
    // } catch (error) {
    //   console.error("Gagal mendapat respon:", error);
    // }

    const systemMessage = {
    role: "system",
    content: companyInfo // Mengambil dari data yang sudah kita latih
    };
    
    const lastMessages = history.slice(-6).map(({ role, text }) => ({
      role: role === "model" ? "assistant" : "user",
      content: text,
    }));

    const finalMessages = [systemMessage, ...lastMessages];

    try {
      const url = import.meta.env.VITE_LLAMA_API_URL;
      //SETTING REQUEST: API Key harus di Headers (Authorization)
      const response = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_LLAMA_API_KEY}` 
        },
        body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: finalMessages,
        temperature: 0.1, 
        })
      });

      const data = await response.json();

      // CEK ERROR
      if (!response.ok) {
        throw new Error(data.error?.message || `Error ${response.status}`);
      }

      // Gemini pakai data.candidates[0]...
      // Llama/Groq pakai data.choices[0].message.content
      const apiResponseText = data.choices[0].message.content.trim();
      
      updateHistory(apiResponseText);
    } 
    catch (error) {
      console.error("Gagal mendapat respon:", error);
    }
  }

  return (
  <div className="container">
    <div className="chatbot-popup">
      {/* Chat Bot Header */}
      <div className="chat-header">
        <div className="header-info">
          <ChatbotIcon />
          <h2 className="logo-text">MAI</h2>
        </div>
        <button className="material-symbols-outlined">keyboard_arrow_down</button>
      </div>

      {/* Chat Bot Body */}
      <div className="chat-body" ref={chatBodyRef}>
        <div className="message bot-message">
          <ChatbotIcon />
          <p className="message-text">
            MAI di sini <br/> Ada yang bisa saya bantu ?
          </p>
        </div>
        {ChatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>
            {/* Chat Bot Footeer */}
      <div className="chat-footer">
        <ChatForm ChatHistory={ChatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
      </div>
    </div>
  </div>
  )
}

export default App