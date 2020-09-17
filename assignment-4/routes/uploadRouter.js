const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { // cb : callback
        cb(null, 'public/images');

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // stores the original name of file as being uploaded
    },
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { // to check file extension
        return cb(new Error('You must upload only image files'));
    } else {
        cb(null, true);
    }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });


const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { // to implement cors
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload!!!');

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
        // upload.single('imageFile') takes form name from frontend
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file); // also send back the url of where the image is stored
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload!!!');

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload!!!');

    })


module.exports = uploadRouter;