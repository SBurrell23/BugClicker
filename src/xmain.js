import { createApp } from 'vue';
import App from './App.vue';
import 'hacktimer/HackTimer.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App)

app.mount('#app')
