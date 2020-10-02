// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('src'));

app.all('*', (req, res) => {
    res.sendFile(`${__dirname}/src/index.html`);
});

app.listen(port);
