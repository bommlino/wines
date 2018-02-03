const config = require('./config')
const restify = require('restify')
const mongoose = require('mongoose')
const server = restify.createServer()
const restifyPlugins = require('restify-plugins')

function respond(req, res) {
	res.send('Hello Tresmo!')
}

server.get('/', respond)

/**
  * Restify Plugins
  */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }))
server.use(restifyPlugins.acceptParser(server.acceptable))
server.use(restifyPlugins.queryParser({ mapParams: true }))
server.use(restifyPlugins.fullResponse())

// listen strats the server on the given port.
exports.listen = function(callback) {

	// console.error('connecting to db')
	// establish connection to mongodb
	mongoose.Promise = global.Promise
	mongoose.connect(config.db.uri)

	const db = mongoose.connection

	db.on('error', (err) => {
		console.error(err)
		process.exit(1)
	})

	db.once('open', () => {
		require('./routes/routes')(server)
	})

	// let port = config.port
	console.log('Listening on: ' + config.port)
	server.listen(config.port, callback)
}

// // close destroys the server.
exports.close = function (callback) {
	console.log('closing server')
	server.close(callback)
}