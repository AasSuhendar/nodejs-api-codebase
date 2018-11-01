const main = require('../../controllers/index')
const sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect

var assert = require('assert');
describe('Controllers Index', function () {
    describe('Main controller route /', function () {
        it('should return json message', function () {
            let res = {
                send: sinon.spy()
            }
            let req = {}
            
            main.getIndex(req, res)
            expect(res.send.calledOnce).to.be.true;

            expect(res.send.firstCall.args[0].status).to.equal(true);
            expect(res.send.firstCall.args[0].statusCode).to.equal(200);
            expect(res.send.firstCall.args[0].msg).to.equal('Wellcome main endpoint API Users Service');
        });
    });
});