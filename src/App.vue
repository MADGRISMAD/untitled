<template>
    <div class="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 class="text-4xl font-bold mb-10">
        <span class="server-status" :class="{ 'server-running': serverStatus === 'running', 'server-stopped': serverStatus === 'stopped' }"></span>
        Control de servidor de Minecraft
      </h1>
      <div class="max-w-lg mx-auto mb-10">
        <div class="gif-container" v-if="gifUrl">
          <img :src="gifUrl" alt="Gif relacionado con el servidor" class="w-full h-auto">
        </div>
      </div>
      <div class="flex">
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
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        serverStatus: 'stopped',
        loading: false,
        gifUrl: ''
      };
    },
    methods: {
      async startServer() {
        this.loading = true;
        setTimeout(async () => {
          this.serverStatus = 'running';
          await this.fetchGif();
          this.loading = false;
        }, 1000);
      },
      async stopServer() {
        this.loading = true;
        setTimeout(async () => {
          this.serverStatus = 'stopped';
          await this.fetchGif();
          this.loading = false;
        }, 1000);
      },
      async fetchGif() {
        var query = this.serverStatus === 'running' ? 'minecraft' : 'bye bye';
        var params = {
          q: query,
          limit: 20,
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
      }
    }
  };
  </script>
  
  <style>
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
  </style>
  