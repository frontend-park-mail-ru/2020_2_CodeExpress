// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');

const app = express();

app.use(express.static('src'));

app.all('*', (req, res) => {
    res.sendFile(`${__dirname}/src/index.html`);
});

app.listen(8080);
