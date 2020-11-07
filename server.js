const express = require('express');
const https = require('https');
const fs = require('fs');
const http = require('http');

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
http.createServer(function (req, res) {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(80);
