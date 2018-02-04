var server = require('../server.js')
var assert = require('assert')
var http = require('http')
const config = require('../config')    

var base_url = 'http://localhost/' + config.port

describe('Test wines', function () {
	before(done => {
		server.listen(done)
	})

	after(done => {
		server.close(done)
		process.exit(0)
	})

	it('should return 200', function (done) {
		http.get(base_url + '/wines', function (res) {
			assert.equal(200, res.statusCode)
			done()
		})
	})
})
