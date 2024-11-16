import "./assets/main.css";
import store from "./stores";
import { createApp } from "vue";
import { createPinia } from "pinia";
import "flowbite";

import App from "./App.vue";
import router from "./router";
import VueKonva from "vue-konva";
import './registerServiceWorker'

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(store);
app.use(VueKonva);

app.mount("#app");
