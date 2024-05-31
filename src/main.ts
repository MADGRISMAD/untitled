import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { defineComponent } from 'vue'
const AppComponent = defineComponent({
  components: {
    App
  }
})

createApp(AppComponent).mount('#app')
