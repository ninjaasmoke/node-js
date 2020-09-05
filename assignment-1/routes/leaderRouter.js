const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        // modification of res is carried from app.all
        res.end('Will send all the leaders to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the leader: ' + req.body.name + '\nwith details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on leaders!!!');
    })
    .delete((req, res, next) => {
        res.end('Deleting all leaders');
    });

// // With params

leaderRouter.route('/:leaderID')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        // modification of res is carried from app.all
        res.end('Will send details of leader with id : ' + req.params.leaderID + '  to you!');
    })
    .post((req, res, next) => {
        res.end('POST operation not supported on leader with ID!!!');
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description + ' and ID: ' + req.params.leaderID);
    })
    .delete((req, res, next) => {
        res.end('Deleting leader with ID : ' + req.params.leaderID);
    });


module.exports = leaderRouter;