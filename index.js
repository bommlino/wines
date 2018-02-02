const config = require('./config');
const restify = require("restify");
// var mongodb = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const server = restify.createServer();
const restifyPlugins = require('restify-plugins');

function respond(req, res, next) {
    res.send('Hello World!');
}

server.get('/', respond);

/**
  * Restify Plugins
  */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

server.listen(config.port, () => {

	// establish connection to mongodb
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db.uri);

	const db = mongoose.connection;

	db.on('error', (err) => {
	    console.error(err);
	    process.exit(1);
	});

	db.once('open', () => {
	    require('./routes/routes')(server);
	    console.log(`Server is listening on port ${config.port}`);
	});
})