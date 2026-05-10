# React + Vite

chat bot ini menggunakan API dari LLAMA bukan offline 
jadi harus buat API key pada web https://console.groq.com/docs/overview
lalu sesuaikan API url dan API key pada .env

jika mau dari PC sendiri atau offline download otak terlebih dahulu di https://ollama.com/download/windows dan install olama dari bash,cmd,pws command = ollama pull llama3

ollama jalan di http://localhost:11434

Jika menggunakan ollama offline dengan download otak dari website di atas maka perlu set di Environment Variables dan isi variable name = OLLAMA_ORIGINS variable value = http://192.168.1.55:5173 (Alamat AI) PC untuk mencegah blocked by CORS 

npm install = untuk node modules

npm install lucide-react = Untuk ikon chat, kirim, dan bot

npm install ollama = untuk package ollama

<img width="439" height="652" alt="MAI" src="https://github.com/user-attachments/assets/4f7b4f07-bf34-4a3f-ad4a-560bb3dbcebd" />

