const errors = require('restify-errors');

/**
 * Wine Schema
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
                    new errors.InvalidContentError(err.message),
                );
            }

            res.send(docs);
            next();
        });
    });

    /**
     * Get a wine by id
     */
    server.get('/wines/:wine_id', (req, res, next) => {
        Wine.findOne({ _id: req.params.wine_id }, function(err, doc) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.message),
                );
            } else if (!doc) {
                return next(
                    new errors.ResourceNotFoundError(
                        'The resource you requested could not be found.',
                    ),
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
                    new errors.InvalidContentError(err.message),
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
                        new errors.InvalidContentError(err.message),
                    );
                }

                res.send(200, data);
                next();
            });
        });
    });

    /**
     * Delete wine with given ID
     */
    server.del('/wines/:wine_id', (req, res, next) => {
        Wine.remove({ _id: req.params.wine_id }, function(err) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.message),
                );
            }

            res.send(204);
            next();
        });
    });
};  




// 'use strict'

// var WINES_COLLECTION = "wines";

// module.exports = function(ctx) {

//     // extract context from passed in object
//     const db     = ctx.db
//     const server = ctx.server

//     const allWines = db.collection('wines')

//     /**
//      * Return a list of wine objects
//      */
//      server.get('/wines', (req, res, next) => {

//         let limit = parseInt(req.query.limit, 10) || 10, // default limit to 10 wines
//             skip  = parseInt(req.query.skip, 10) || 0, // default skip to 0 wines
//             query = req.query || {}

//         // remove skip and limit from query to avoid false querying
//         delete query.skip
//         delete query.limit

//         // find todos and convert to array (with optional query, skip and limit)
//         allWines.find(query).skip(skip).limit(limit).toArray()
//         .then(wines => res.send(200, wines))
//         .catch(err => res.send(500, err))

//         next()

//     })


//     /**
//      * Create wine entry
//      */
//      server.post('/wines', (req, res, next) => {

//         var newWine = req.body;

//         if (!req.body.name || !req.body.year || !req.body.country || !req.body.type) {
//             handleError(res, "Invalid user input", "Must provide a name, year, country, and type.", 400);
//         }

//         // insert wine into wine collection
//         allWines.insertOne(newWine)
//         .then(doc => res.send(200, doc.ops[0]))
//         .catch(err => res.send(500, err))

//         next()

//     })


//     /**
//      * Update the wine with given id
//      */
//      server.put('/wines/:id', (req, res, next) => {

//       var updateWine = req.body;
//       delete updateWine._id;

//       db.collection(WINES_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateWine, function(err, doc) {
//         if (err) {
//           handleError(res, err.message, "Failed to update wine");
//       } else {
//           updateWine._id = req.params.id;
//           res.status(200).json(updateWine);
//       }
//     });

//       allWines.findOneAndUpdate(query, body, opts)
//       .then(doc => res.send(204))
//       .catch(err => res.send(500, err))

//       next()

//   })

//     /**
//      * Delete
//      */
//      server.del('/wines/:id', (req, res, next) => {

//         // remove one document based on passed in id (via route)
//         allWines.findOneAndDelete({ _id: req.params.id })
//         .then(doc => res.send(204))
//         .catch(err => res.send(500, err))

//         next()

//     })

//  }