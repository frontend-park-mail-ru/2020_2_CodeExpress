const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

app.use(express.static('dist'));

httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/musicexpress.sarafa2n.ru/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/musicexpress.sarafa2n.ru/fullchain.pem'),
};

app.all('*', (req, res) => {
    res.sendFile(`${__dirname}/dist/index.html`);
});

https.createServer(httpsOptions, app).listen(443);
