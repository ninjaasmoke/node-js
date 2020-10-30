const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favourites = require('../models/favourite');
const Dishes = require('../models/dishes');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id }, (err, fav) => {
            if (err) {
                return next(err);
            }
            if (!fav) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'plain/text');
                res.end('You have no favourite dishes yet!!!');
            }
        })
            .populate('user')
            .populate('favouriteDishes')
            .then((favourites) => {
                if (favourites) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourites);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id }, (err, fav) => {
            console.log('User ID: ', req.user._id);
            if (err) {
                return next(err);
            }
            if (!fav) {
                console.log('Some dishes are present');
                Favourites.create({ user: req.user._id })
                    .then((favourite) => {
                        for (var dish = 0; dish < req.body.dishes.length; dish++) {
                            favourite.favouriteDishes.push(req.body.dishes[dish]);
                        }
                        favourite.save()
                            .then((favourite) => {
                                Favourites.findById(favourite._id)
                                    .populate('user')
                                    .populate('favouriteDishes')
                                    .then((favourite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favourite);
                                    })
                                    .catch((err) => next(err))
                            });
                    }, (err) => next(err))
                    .catch((err) => next(err));
            } else {
                for (var dish = 0; dish < req.body.dishes.length; dish++) {
                    if (fav.favouriteDishes.indexOf(req.body.dishes[dish]) === -1) {
                        fav.favouriteDishes.push(req.body.dishes[dish]);
                    } else {
                        console.log("\vDish already fav");
                    }
                }
                fav.save()
                    .then((favourite) => {
                        Favourites.findById(favourite._id)
                            .populate('user')
                            .populate('favouriteDishes')
                            .then((favourite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favourite);
                            })
                            .catch((err) => next(err))
                    });
            }
        })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        var err = new Error('PUT operation not supported on /favourites');
        err.status = 403;
        return next(err);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.remove({ user: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })



favouriteRouter.route('/:dishId')
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((favourites) => {
                if (!favourites) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    return res.json({ 'exists': false, 'favourites': favourites })
                }
                else {
                    if (favourites.favouriteDishes.indexOf(req.params.dishId) < 0) {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        return res.json({ 'exists': false, 'favourites': favourites })
                    }
                    else {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        return res.json({ 'exists': true, 'favourites': favourites })
                    }
                }
            })
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id }, (err, favourite) => {
            if (err) {
                return next(err);
            }
            if (!favourite) {
                Favourites.create({ user: req.user._id })
                    .then((favourite) => {
                        favourite.favouriteDishes.push(req.params.dishId);
                        favourite.save()
                            .then((favourite) => {
                                Favourites.findById(favourite._id)
                                    .populate('user')
                                    .populate('favouriteDishes')
                                    .then((favourite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favourite);
                                    })
                                    .catch((err) => next(err))
                                console.log('\nFavourite Created: ', favourite);
                            })
                    }, (err) => next(err))
                    .catch((err) => next(err));
            } else {
                console.log(favourite);
                if (favourite.favouriteDishes.indexOf(req.params.dishId) < 0) {
                    favourite.favouriteDishes.push(req.params.dishId);
                    favourite.save()
                        .then((favourite) => {
                            Favourites.findById(favourite._id)
                                .populate('user')
                                .populate('favouriteDishes')
                                .then((favourite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favourite);
                                })
                                .catch((err) => next(err))
                        })
                } else {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'plain/text');
                    res.end('Favourite already exists');
                }
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        var err = new Error('PUT operation not supported on /favourites/' + req.params.dishId);
        err.status = 403;
        return next(err);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log('Req params : ' + req.params.dishId);
        Favourites.findOne({ user: req.user._id }, (err, fav) => {
            console.log('Fav: ', fav);
            if (err) {
                return next(err);
            }
            if (!fav) {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'plain/text');
                res.end('Favourite doesn\'t exist!!!');
            }
            if (fav.favouriteDishes.indexOf(req.params.dishId) !== -1) { // dish found
                fav.favouriteDishes.splice(req.params.dishId, 1);
                fav.save()
                    .then((favourite) => {
                        Favourites.findById(favourite._id)
                            .populate('user')
                            .populate('favouriteDishes')
                            .then((favourite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favourite);
                            })
                            .catch((err) => next(err))
                    }, (err) => next(err))
                    .catch((err) => next(err));
            } else {
                var err = new Error('No such dish found in your favourite dishes!!');
                err.status = 404;
                return next(err);
            }
        });
    });


module.exports = favouriteRouter;