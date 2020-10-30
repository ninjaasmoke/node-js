const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { // to implement cors
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Promotions.find(req.query)
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.create(req.body)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on promotions!!!');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.remove({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// // With params


promoRouter.route('/:promoID')
    .options(cors.corsWithOptions, (req, res) => { // to implement cors
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        // modification of res is carried from app.all
        Promotions.findById(req.params.promoID)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on promotion with ID!!!');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoID, {
            $set: req.body
        }, { new: true })
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoID)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = promoRouter;