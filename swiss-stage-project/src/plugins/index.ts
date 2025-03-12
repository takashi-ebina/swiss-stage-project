import type { App } from 'vue'

import vuetify from './vuetify'
import router from '../router'
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import { createPinia } from 'pinia';

const pinia = createPinia();

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(useToast)
    .use(pinia)
}
