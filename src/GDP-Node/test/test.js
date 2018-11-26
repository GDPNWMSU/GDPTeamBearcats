process.env.NODE_ENV = 'test'
var controller = require('../../controllers/estimate'),
  mocks = require('node-mocks-http'),
  should = require('should'),
  nock = require('nock')

const LOG = require('../../utils/logger.js')

var request = require('request');
const expect = require('chai').expect
// var request = require('supertest')
LOG.debug('Starting test/controllers/estimateTest.js.')

function buildResponse() {
  return mocks.createResponse({

    eventEmitter: require('events').EventEmitter
  })
}

describe('Services Controller Tests', function () {
  beforeEach(function (done) {
    this.response = mocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })
    done()
  })

  /**
   * Team 05 
   * Testing estimate/ controller using GET Method
   * Expected Result: response status code == 200
   */
  it('GET: estimate/', function (done) {
    request('http://localhost:8089/estimate/', function (error, response, body) {
      console.log('Testing default estimate controller:')
      console.log('Expected Result: 200')      
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('Results:')
      expect('Content-type', 'text/html; charset=utf-8')
      expect('X-Powered-By', 'Express')
      expect(response.body.error).equal(undefined)
      expect(response.statusCode).to.be.equal(200)
      done()

    });
  })
  /**
   * Team 05 
   * Testing estimate/edit/:id controller using GET Method
   * Expected Result: response status code == 200
   */
  it('GET: estimate/edit/:id', function (done) {
    request('http://localhost:8089/estimate/edit/1', function (error, response, body) {
      console.log('Testing estimate/:id controller:')
      console.log('Expected Result: 200')
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('Results:')
      if(error) return done(error)
      expect('Content-type', 'text/html; charset=utf-8')
      expect('X-Powered-By', 'Express')
      expect(response.body.error).equal(undefined)
      expect(response.statusCode).to.be.equal(200)
      done()
    });
  })