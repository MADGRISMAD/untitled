<template>
    <div class="dark-theme flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div class="p-8">
        <h1 class="text-4xl font-bold mb-10 text-white">
          <span class="server-status" :class="{ 'server-running': serverStatus === 'running', 'server-stopped': serverStatus === 'stopped' }"></span>
          Control de servidor de Minecraft
        </h1>
        <div class="max-w-lg mx-auto mb-10">
          <div class="gif-container" v-if="gifUrl">
            <img :src="gifUrl" alt="Gif relacionado con el servidor" class="w-full h-auto">
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="startServer" :disabled="serverStatus === 'running'" class="btn-start">
            <img src="/src/assets/rocket.png" alt="Icono de iniciar servidor" class="w-8 h-8 mr-2">
            Iniciar servidor
          </button>
          <button @click="stopServer" :disabled="serverStatus === 'stopped'" class="btn-stop ml-4">
            <img src="/src/assets/banned.png" alt="Icono de detener servidor" class="w-8 h-8 mr-2">
            Detener servidor
          </button>
        </div>
        <div v-if="loading" class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div class="loader"></div>
        </div>
        <div v-if="serverStatus === 'running'" class="mt-4">
          <p class="text-lg font-semibold mb-2 text-white">Dirección IP del servidor:</p>
          <p class="text-xl font-medium bg-gray-100 rounded-lg p-2 cursor-pointer" @click="copyIpAddress">{{ ipAddress }}</p>
          <div v-if="copied" class="text-green-500 mt-2">¡Dirección IP copiada al portapapeles!</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        serverStatus: 'stopped',
        loading: false,
        gifUrl: '',
        ipAddress: '',
        copied: false // Variable para controlar si se ha copiado la dirección IP
      };
    },
    methods: {
      async fetchIpAddress() {
        try {
          const response = await axios.get("https://ua6bjhkpj7.execute-api.us-west-1.amazonaws.com/Check");
          if (response.status === 200 && response.data.message) {
            const ipAddress = response.data.message.split(": ")[1];
            console.log("Current IP address:", ipAddress);
            return ipAddress;
          } else {
            console.error("Failed to fetch IP address");
            return null;
          }
        } catch (error) {
          console.error("Error fetching IP address:", error);
          return null;
        }
      },
      async startServer() {
        this.loading = true;
        const ipAddress = await this.fetchIpAddress();
        if (!ipAddress) {
          this.loading = false;
          return;
        }
        try {
          const response = await axios.post(`https://ua6bjhkpj7.execute-api.us-west-1.amazonaws.com/StartServer`);
          if (response.status === 200) {
            console.log("Server started successfully");
            this.serverStatus = 'running';
            await this.fetchGif();
            this.ipAddress = ipAddress; // Asignar la dirección IP al componente
          } else {
            console.error("Server failed to start");
          }
        } catch (error) {
          console.error("Error starting server:", error);
        } finally {
          this.loading = false;
        }
      },
      async stopServer() {
        this.loading = true;
        const ipAddress = await this.fetchIpAddress();
        if (!ipAddress) {
          this.loading = false;
          return;
        }
        try {
          const response = await axios.post(`https://ua6bjhkpj7.execute-api.us-west-1.amazonaws.com/StopServer`);
          if (response.status === 200) {
            console.log("Server stopped successfully");
            this.serverStatus = 'stopped';
            await this.fetchGif();
          } else {
            console.error("Server failed to stop");
          }
        } catch (error) {
          console.error("Error stopping server:", error);
        } finally {
          this.loading = false;
        }
      },
      async fetchGif() {
        var query = this.serverStatus === 'running' ? 'minecraft' : 'bye bye';
        var params = {
          q: query,
          limit: 10,
          api_key: "aFFKTuSMjd6j0wwjpFCPXZipQbcnw3vB",
          fmt: "json",
          _t: Date.now()
        };
  
        try {
          const response = await axios.get("https://api.giphy.com/v1/gifs/search", { params });
          if (response.data.data.length > 0) {
            const randomIndex = Math.floor(Math.random() * response.data.data.length);
            this.gifUrl = response.data.data[randomIndex].images.fixed_height.url;
          }
        } catch (error) {
          console.error("Error fetching gif:", error);
        }
      },
      copyIpAddress() {
        const ipAddressElement = document.createElement("textarea");
        ipAddressElement.value = this.ipAddress;
        document.body.appendChild(ipAddressElement);
        ipAddressElement.select();
        document.execCommand("copy");
        document.body.removeChild(ipAddressElement);
        this.copied = true; // Indicar que la dirección IP se ha copiado
        setTimeout(() => {
          this.copied = false; // Reiniciar el estado de la variable 'copied' después de un tiempo
        }, 3000); // Reiniciar después de 3 segundos (ajustable)
      }
    }
  };
  </script>
  
  <style scoped>
  .dark-theme {
    background-color: #1a202c;
  }
  
  .server-status {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
  
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  
  .server-running {
    background-color: #2ecc71;
    animation: blink 1s linear infinite;
  }
  
  .server-stopped {
    background-color: #e74c3c;
    animation: blink 1s linear infinite;
  }
  
  .loader {
    border: 4px solid #f3f3f3;
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 50px;
    height: 50px;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
  }
  
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .btn-start,
  .btn-stop {
    padding: 12px 24px;
    font-size: 18px;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .btn-start {
    background-color: #2ecc71;
  }
  
  .btn-stop {
    background-color: #e74c3c;
  }
  
  .gif-container {
    max-width: 600px;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  </style>
  