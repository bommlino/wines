/**
 * Module Dependencies
 */
const errors = require('restify-errors');

/**
 * Model Schema
 */
const Wine = require('../models/wine');

module.exports = function(server) {

    /**
     * Add new wine to db
     */
    server.post('/wines', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let data = req.body || {};

        let wine = new Wine(data);
        wine.save(function(err) {
            if (err) {
                console.error(err);
                return next(new errors.InternalError(err.message));
                next();
            }

            res.send(201);
            next();
        });
    });

    /**
     * Returns a list of wine objects
     */
    server.get('/wines', (req, res, next) => {
        Wine.apiQuery(req.params, function(err, docs) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }

            res.send(docs);
            next();
        });
    });

    /**
     * GET
     */
    server.get('/wines/:wine_id', (req, res, next) => {
        Wine.findOne({ _id: req.params.wine_id }, function(err, doc) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }

            res.send(doc);
            next();
        });
    });

    /**
     * Update the wine with the given id
     */
    server.put('/wines/:wine_id', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let data = req.body || {};

        if (!data._id) {
            data = Object.assign({}, data, { _id: req.params.wine_id });
        }

        Wine.findOne({ _id: req.params.wine_id }, function(err, doc) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            } else if (!doc) {
                return next(
                    new errors.ResourceNotFoundError(
                        'The resource you requested could not be found.',
                    ),
                );
            }

            Wine.update({ _id: data._id }, data, function(err) {
                if (err) {
                    console.error(err);
                    return next(
                        new errors.InvalidContentError(err.errors.name.message),
                    );
                }

                res.send(200, data);
                next();
            });
        });
    });

    /**
     * DELETE
     */
    server.del('/wines/:wine_id', (req, res, next) => {
        Wine.remove({ _id: req.params.wine_id }, function(err) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }

            res.send(204);
            next();
        });
    });
};  