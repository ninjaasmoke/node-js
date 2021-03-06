const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => { // req is request from client-side
    console.log("Request for " + req.url + " by method " + req.method);

    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/html');
    // res.end('<html><body><h1>Hello World</h1></body></html>');

    if (req.method == "GET") {
        var fileUrl;
        if (req.url == '/') fileUrl = '/index.html';
        else fileUrl = req.url;

        var filePath = path.resolve('./public' + fileUrl); // fileUrl starts with '/' automatically

        const fileExt = path.extname(filePath);

        if (fileExt == '.html') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<html><body><br><br><h3>Error 404:<br>' + fileUrl + ' not found</h3></body></html>');
                    return;
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html');
                    fs.createReadStream(filePath).pipe(res);
                }
            })
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><br><br><h3>Error 404: <br>' + fileUrl + ' not an HTML file</h3></body></html>');
            return;
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><br><br><h3>Error 404:<br>' + req.method + ' not supported</h3></body></html>');
        return;
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`); // eclosing in `` as we need to use vars in line
})