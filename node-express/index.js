const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRoutes');

const hostname = 'localhost';
const port = 3000;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/dishes', dishRouter);


// app.all('/dishes', (req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// });

// app.get('/dishes', (req, res, next) => {
//     // modification of res is carried from app.all
//     res.end('Will send all the dishes to you!');
// });

// app.post('/dishes', (req, res, next) => {
//     res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
// });

// app.put('/dishes', (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on dishes!!!');
// });

// // Dangerous operation without authentication
// app.delete('/dishes', (req, res, next) => {
//     res.end('Deleting all dishes');
// });

// // With params

// app.get('/dishes/:dishId', (req, res, next) => {
//     // modification of res is carried from app.all
//     res.end('Will send details of Dish Id: ' + req.params.dishId + ' to you!');
// });

// app.post('/dishes/:dishId', (req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /dishes/' + req.params.dishId);
// });

// app.put('/dishes/:dishId', (req, res, next) => {
//     res.write('Updating the dish: ' + req.params.dishId + '\n');
//     res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
// });

// // Dangerous operation without authentication
// app.delete('/dishes/:dishId', (req, res, next) => {
//     res.end('Deleting dish: ' + req.params.dishId);
// });

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Comtent-Type', 'text/html');
    res.end('<html><body><h1>This is new express server</h1></body></html>');
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});