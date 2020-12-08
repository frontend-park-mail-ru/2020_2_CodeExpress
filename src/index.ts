import { App } from 'components/app/app';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then();
    });
}

const parent: HTMLElement = document.getElementById('app') as HTMLElement;
export const app = new App({ parent });

app.start();
