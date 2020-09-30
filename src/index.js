import { App } from './components/app/app.js';

const parent = document.getElementById('app');
const app = new App({ parent });

app.start();
