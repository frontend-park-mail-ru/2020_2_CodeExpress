import { App } from 'components/app/app';

const parent: HTMLElement = document.getElementById('app') as HTMLElement;
const app = new App({ parent });

app.start();
