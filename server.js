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

// connection to mongoDB
mongoose.connect(config.db.uri)  
require('./routes/routes')(server)

server.listen(config.port, function () {
    console.log('Server is listening on port ' + config.port)
});

exports.server = server