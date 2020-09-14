const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        if (!authenticate.verifyAdmin(req.user)) {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        } else {
            Promotions.create(req.body)
                .then((promotion) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promotion);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        if (!authenticate.verifyAdmin(req.user)) {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        } else {
            res.statusCode = 403;
            res.end('PUT operation not supported on promotions!!!');
        }
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        if (!authenticate.verifyAdmin(req.user)) {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        } else {
            Promotions.remove({})
                .then((response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    });

// // With params


promoRouter.route('/:promoID')
    .get((req, res, next) => {
        // modification of res is carried from app.all
        Promotions.findById(req.params.promoID)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        if (!authenticate.verifyAdmin(req.user)) {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        } else {
            res.statusCode = 403;
            res.end('POST operation not supported on promotion with ID!!!');
        }
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        if (!authenticate.verifyAdmin(req.user)) {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        } else {
            Promotions.findByIdAndUpdate(req.params.promoID, {
                $set: req.body
            }, { new: true })
                .then((promotion) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promotion);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        if (!authenticate.verifyAdmin(req.user)) {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        } else {
            Promotions.findByIdAndRemove(req.params.promoID)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    });


module.exports = promoRouter;