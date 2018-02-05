const Wine = require('../models/wine')

var assert = require('assert')
var request = require('supertest')
var app = require('../server').server
var chai = require('chai')
var expect = chai.expect

// clean database
before(function (done) {
	Wine.remove({}, function(err) { 
		if(err)
			console.log('could not remove wine collection')
	})
	done()
})

describe('Test wines app', function () {
	it('should return 200', function (done) {
		request(app)
			.get('/wines')
			.end (function (err, res) {
				assert.equal(200, res.statusCode)
				expect(res.body).to.be.an('array') 
				done()
			})
	})
})

describe('Insert and delete new wine ', function() { 

	var wine = { 
		name: 'Test wine',
		year: 2012,
		country: 'California',
		type: 'red' 
	}


	var vine_id

	it('should insert a wine', function(done) { 
		request(app)
			.post('/wines')
			.send(wine) 
			.end(function(err, res) { 
				expect(res.statusCode).to.equal(201) 
				done() 
			}) 
	}) 

	it('should then return that wine', function (done) {
		request(app)
			.get('/wines')
			.end (function (err, res) {
				assert.equal(200, res.statusCode)
				expect(res.body).to.be.an('array')
				expect(res.body).to.have.lengthOf(1) 
				vine_id = res.body[0]._id
				console.log(vine_id)
				console.log(res.body)
				done()
			})
	})

	it('and delete the wine', function (done) {
		request(app)
			.delete('/wines/' + vine_id)
			.end(function(err, res) { 
				expect(res.statusCode).to.equal(204) 
				done() 
			}) 
	}) 


	it('wines should be empty', function (done) {
		request(app)
			.get('/wines')
			.end (function (err, res) {
				assert.equal(200, res.statusCode)
				expect(res.body).to.be.an('array') 
				expect(res.body).to.have.lengthOf(1) 
				done()
			})
	})
}) 
