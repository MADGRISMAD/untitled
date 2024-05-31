<template>
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold mb-4">Control de servidor de Minecraft</h1>
      <div>
        <button @click="startServer" :disabled="serverStatus === 'running'" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Iniciar servidor
        </button>
        <button @click="stopServer" :disabled="serverStatus === 'stopped'" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Detener servidor
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        serverStatus: 'stopped', 
      };
    },
    methods: {
      startServer() {
        
        this.serverStatus = 'running'; 
      },
      stopServer() {
        
        this.serverStatus = 'stopped'; 
      },
    },
  };
  </script>
