process.env.NODE_ENV = 'test'
var app = require('../'),
  mocks = require('node-mocks-http')
var server = require('../app')
const LOG = require('../utils/logger.js')

var request = require('request');
const chai = require('chai')
const expect = chai.expect
let chaiHttp = require('chai-http');
let should = chai.should();


chai.use(chaiHttp);
LOG.debug('Starting test/controllers/')

function buildResponse() {
  return mocks.createResponse({
    eventEmitter: require('events').EventEmitter
  })
}

describe('Login Controller Tests', function () {
  beforeEach(function (done) {
    this.response = mocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })
    done()
  })
  it('GET: login/', function (done) {
    chai.request(server).get('/login').send().end(function (error, response) {
      console.log('Testing default login GET controller:')
      console.log('Expected Result: 200')
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('Results:')
      response.should.have.status(200);
      done()
    });
  })

  it('POST: login/', function (done) {
    let userLogin = {
      email: "abc@admin.com",
      password: "testing"
    }
    chai.request(server).post('/login').send(userLogin).end(function (error, response) {
      console.log('Testing default login POST controller:')
      console.log('Expected Result: 200')
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('Results:')
      response.should.have.status(200);
      done()
    });
  })
})
describe('Home Controller Tests', function () {
  beforeEach(function (done) {
    this.response = mocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })
    done()
  })
  it('GET: /', function (done) {
    chai.request(server).get('/').send().end(function (error, response) {
      console.log('Testing default server GET controller:')
      console.log('Expected Result: 200')
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('Results:')
      response.should.have.status(200);
      done()
    });
  })

  it('POST: login/', function (done) {
    chai.request(server).post('/').send().end(function (error, response) {
      console.log('Testing default server POST controller:')
      console.log('Expected Result: 404')
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('Results:')
      response.should.have.status(404);
      done()
    });
  })
})
describe('View database Controller Tests', function () {
  beforeEach(function (done) {
    this.response = mocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })
    done()
  })
  it('GET: /view/', function (done) {
    chai.request(server).get('/view').send().end(function (error, response) {
      console.log('Testing GET view database controller:')
      console.log('Expected Result: 200')
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('Results:')
      response.should.have.status(200);
      done()
    });
  })
  it('GET: /view/testing', function (done) {
    chai.request(server).get('/view').send().end(function (error, response) {
      console.log('Testing GET view database for testing table from controller:')
      console.log('Expected Result: 200')
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('Results:')
      response.should.have.status(200);
      done()
    });
  })
})
describe('Manage Users database Controller Tests', function () {
  beforeEach(function (done) {
    this.response = mocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })
    done()
  })
  it('GET: /manage/', function (done) {
    chai.request(server).get('/manage').send().end(function (error, response) {
      console.log('Testing GET manage users controller:')
      console.log('Expected Result: 200')
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('Results:')
      response.should.have.status(200);
      done()
    });
  })
  it('GET: /manage/', function (done) {
    var checkUserController = require('../controllers/manage').checkUser
    var isValid = checkUserController('rajasrikar2010@gmail.com')
    expect(isValid).to.be.true;
    done();
  })
})