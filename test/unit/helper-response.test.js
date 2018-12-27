const response = require('../../helpers/response')
const sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect

process.env.NODE_ENV = 'test'

describe('Helpers', function () {
    describe('Response Helpers', function () {
        it('should return json message successResponse', function () {
            let successResponse = sinon.stub(response, 'successResponse').callsFake(() => {
                return {
                    status: true,
                    statusCode: 200,
                    code: 'code',
                    msg: 'msg'
                }
            })

            let res = {
                send: sinon.spy()
            }
            let req = {}
            response.successResponse(req, res)
            successResponse.restore()

        });
    });
});