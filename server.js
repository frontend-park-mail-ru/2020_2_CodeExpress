// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('dist'));

app.all('*', (req, res) => {
    res.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(port);
