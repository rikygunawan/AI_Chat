import chatbotLogo from '../assets/mm.png'; 

const ChatbotIcon = () => {
  return (
    <img 
      src={chatbotLogo} 
      alt="Chatbot Icon" 
      style={{ 
        width: '50px', 
        height: '50px', 
        borderRadius: '50%', // Tambahkan ini jika ingin gambar bulat
        objectFit: 'cover' 
      }} 
    />
  );
};

export default ChatbotIcon;