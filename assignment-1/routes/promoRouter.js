const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        // modification of res is carried from app.all
        res.end('Will send all the promotions to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on promotions!!!');
    })
    .delete((req, res, next) => {
        res.end('Deleting all promotions');
    });

// // With params

promoRouter.route('/:promoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        // modification of res is carried from app.all
        res.end('Will send details of Promotion with id : ' + req.params.promoId + '  to you!');
    })
    .post((req, res, next) => {
        res.end('POST operation not supported on promotion with ID!!!');
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description + ' and ID: ' + req.params.promoId);
    })
    .delete((req, res, next) => {
        res.end('Deleting promotion with ID : ' + req.params.promoId);
    });


module.exports = promoRouter;