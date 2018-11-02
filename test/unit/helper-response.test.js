const response = require('../../helpers/response')
const sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect

describe('Helpers', function () {
    describe('Response Helpers', function () {
        it('should return json message successResponse200', function () {
            let successResponse200 = sinon.stub(response, 'successResponse200').callsFake(() => {
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
            let atodo = response.successResponse200(req, res)
            // console.log(atodo);
            successResponse200.restore()
            
        });

        // it('should return json message failedResponse403', function () {
        //     let failedResponse403 = sinon.stub(response, 'failedResponse403').callsFake(() => {
        //         return {
        //             status: true,
        //             statusCode: 403,
        //             code: 'code',
        //             msg: 'msg'
        //         }
        //     })

        //     let res = {
        //         send: sinon.spy()
        //     }
        //     let req = {}
        //     let atodo = response.failedResponse403(req, res)
        //     console.log(atodo);
        //     failedResponse403.restore()

        // });
    });
});