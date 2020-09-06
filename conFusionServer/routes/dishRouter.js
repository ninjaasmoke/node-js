const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        // modification of res is carried from app.all
        res.end('Will send all the dishes to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on dishes!!!');
    })
    .delete((req, res, next) => {
        res.end('Deleting all dishes');
    });

// // With params

dishRouter.route('/:dishId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        // modification of res is carried from app.all
        res.end('Will send details of Dish with id : ' + req.params.dishId + '  to you!');
    })
    .post((req, res, next) => {
        res.end('POST operation not supported on dish with ID!!!');
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description + ' and ID: ' + req.params.dishId);
    })
    .delete((req, res, next) => {
        res.end('Deleting dish with ID : ' + req.params.dishId);
    });


module.exports = dishRouter;