// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');

const app = express();

app.use(express.static('public'));

app.all('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(8080);
