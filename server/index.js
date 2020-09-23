const fs = require('fs');
const http = require('http');
const debug = require('debug')('http');

const index = http.createServer((req, res) => {
    const path = `./public${req.url === '/' ? '/index.html' : req.url}`;

    fs.readFile(path, (err, file) => {
        if (err) {
            res.write('error');
            res.end();

            return;
        }

        res.write(file);
        res.end();
    });

});

index.listen(8080);
