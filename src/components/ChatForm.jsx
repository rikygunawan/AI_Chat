import { useRef } from "react";

const ChatForm = ({ChatHistory, setChatHistory,generateBotResponse}) => {
    const inputRef = useRef();
    
    // Fungsi untuk otomatis menyesuaikan tinggi textarea
    const handleInput = () => {
        const input = inputRef.current;
        // Reset tinggi ke minimal dulu supaya bisa mengecil saat teks dihapus
        input.style.height = "auto"; 
        // Set tinggi sesuai dengan tinggi konten teks di dalamnya
        input.style.height = `${input.scrollHeight}px`; 
    }

    const handleFormSubmit = (e) => {
        if(e)e.preventDefault(); // Cek jika ada event, baru preventDefault kirim chat ketika enter

        const userMessage = inputRef.current.value.trim();
        if(!userMessage)return;
        inputRef.current.value = "";

        // Reset tinggi ke semula setelah kirim
        inputRef.current.style.height = "auto"; 

        // Update history chat user
        setChatHistory(history => [...history,{role: "user", text: userMessage}]);

        // Respon Chat AI
        setTimeout(() => setChatHistory(history => [...history,{role: "model", text: "Berpikir..."}])
        ,200);

        generateBotResponse([...ChatHistory.slice(-10),{role : "user", text: `${userMessage}`}]);
    }

    const handleKeyDown = (e) => {
        // Jika tekan Enter SAJA (tanpa Shift), maka kirim chat
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleFormSubmit();
        }
        // Jika tekan Shift + Enter, biarkan saja (dia akan buat baris baru otomatis)
    }    

    return(
        // <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
        //   <input ref={inputRef} type="text" placeholder="Message.." className="message-input" required />
        //   <button className="material-symbols-outlined">arrow_upward</button>
        // </form>
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <textarea
                ref={inputRef}
                placeholder="Message.."
                className="message-input"
                onKeyDown={handleKeyDown}
                onInput={handleInput} // Ini yang bikin tingginya otomatis berubah
                rows="1" // Mulai dari 1 baris
                required
            ></textarea>
            <button type="submit" className="material-symbols-outlined">arrow_upward</button>
        </form>
    )
}

export default ChatForm