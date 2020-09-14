const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');
const { json } = require('express');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get((req, res, next) => {
        // modification of res is carried from app.all
        Dishes.find({})
            .populate('comments.author') // for mongoose population
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => { // adding verification using token
        if (authenticate.verifyAdmin(req.user)) {
            console.log(req.user);
            Dishes.create(req.body)
                .then((dish) => {
                    console.log('Dish created: ', dish);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        }

    })
    .put(authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req.user)) {
            res.statusCode = 403;
            res.end('PUT operation not supported on dishes!!!');
        } else {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        }
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req.user)) {
            Dishes.remove({})
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        }
    });

// // With params

dishRouter.route('/:dishId')
    .get((req, res, next) => {
        // modification of res is carried from app.all
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
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
            res.end('POST operation not supported on dish with ID!!!');
        }

    })
    .put(authenticate.verifyUser, (req, res, next) => {
        if (!authenticate.verifyAdmin(req.user)) {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        } else {
            Dishes.findByIdAndUpdate(req.params.dishId, {
                $set: req.body
            }, { new: true })
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
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
            Dishes.findByIdAndRemove(req.params.dishId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    });


//  for comments

dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        // modification of res is carried from app.all
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.statusCode = 404;
                    return next(err); // see in app.js error handling function which handles this return
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    req.body.author = req.user._id; // to add the user as author; req.user added by passport
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            // res.statusCode = 200;
                            // res.setHeader('Content-Type', 'application/json');
                            // res.json(dish);
                            // to populate user as author
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                });
                        }, (err) => next(err));
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.statusCode = 404;
                    return next(err); // see in app.js error handling function which handles this return
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on dishes/' + req.params.dishId + '/comments');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        if (!authenticate.verifyAdmin(req.user)) {
            var err = new Error('You are not authorized to do this!!!');
            console.log('Not admin');
            err.status = 403;
            return next(err);
        } else {
            Dishes.findById(req.params.dishId)
                .then((dish) => {
                    if (dish != null) {
                        for (var i = (dish.comments.length - 1); i >= 0; i--) { // removes all comments one by one
                            dish.comments.id(dish.comments[i]._id).remove(); // accessing the subdocument
                        }
                        dish.save()
                            .then((dish) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            }, (err) => next(err));
                    } else {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.statusCode = 404;
                        return next(err); // see in app.js error handling function which handles this return
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    });

// // With params

dishRouter.route('/:dishId/comments/:commentID')
    .get((req, res, next) => {
        // modification of res is carried from app.all
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {

                if (dish != null && dish.comments.id(req.params.commentID) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentID));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.statusCode = 404;
                    return next(err); // see in app.js error handling function which handles this return
                } else {
                    err = new Error('Comment ' + req.params.commentID + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentID);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (!req.user._id.equals(dish.comments.id(req.params.commentID).author._id)) { // when author and user are not same
                    // also can use dish.comments.is(req.params.commentID).author without populating the comments
                    console.log('Not same author');
                    var err = new Error('You are not the author!!! Only authors can edit their comments');
                    err.status = 403;
                    return next(err);
                } else { // when author and user are same
                    console.log('Same author');
                    if (dish != null && dish.comments.id(req.params.commentID) != null) {
                        if (req.body.rating) {
                            dish.comments.id(req.params.commentID).rating = req.body.rating;
                        }
                        if (req.body.comment) {
                            dish.comments.id(req.params.commentID).comment = req.body.comment;
                        }
                        dish.save()
                            .then((dish) => {
                                // res.statusCode = 200;
                                // res.setHeader('Content-Type', 'application/json');
                                // res.json(dish);
                                // to populate user as author
                                Dishes.findById(dish._id)
                                    .populate('comments.author')
                                    .then((dish) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(dish);
                                    });
                            }, (err) => next(err));
                    } else if (dish == null) {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.statusCode = 404;
                        return next(err); // see in app.js error handling function which handles this return
                    } else {
                        err = new Error('Comment ' + req.params.commentID + ' not found');
                        err.statusCode = 404;
                        return next(err);
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (!req.user._id.equals(dish.comments.id(req.params.commentID).author._id)) { // when author and user are not same
                    console.log('Not same author');
                    var err = new Error('You are not the author!!! Only authors can delete their comments');
                    err.status = 403;
                    return next(err);
                } else { // when author and user are same
                    if (dish != null && dish.comments.id(req.params.commentID) != null) {
                        dish.comments.id(dish.comments.id(req.params.commentID)._id).remove(); // accessing the subdocument
                        dish.save()
                            .then((dish) => {
                                Dishes.findById(dish._id)
                                    .populate('comments.author')
                                    .then((dish) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(dish);
                                    });
                            }, (err) => next(err));
                    } else if (dish == null) {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.statusCode = 404;
                        return next(err); // see in app.js error handling function which handles this return
                    } else {
                        err = new Error('Comment ' + req.params.commentID + ' not found');
                        err.statusCode = 404;
                        return next(err);
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = dishRouter;