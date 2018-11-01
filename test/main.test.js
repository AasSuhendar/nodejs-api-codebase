const main = require('../controllers/index');
// const todo = require('../controllers/todo');
const sinon = require('sinon');
const request = require('request');
var chai = require('chai');
var spies = require('chai-spies');
var chaiHttp = require('chai-http');
var expect = chai.expect

chai.use(spies);
chai.use(chaiHttp);

const Todo = require('../models/todo')
let baseurl = 'http://localhost:3000'

var assert = require('assert');
describe('Controllers Index', function () {
    describe('Main controller route /', function () {
        // beforeEach(() => {
        //     this.test_stub = sinon.stub(main, 'getIndex').callsFake((req, res) => {
        //         return { status: true, statusCode: 200, msg: 'Wellcome main endpoint API Users Service' }
        //     })
        // })

        // afterEach(() => {
        //     this.test_stub.restore()
        // })

        it('should return json message', function () {
            let res = {
                send:sinon.spy()
            }
            let req = {}
            main.getIndex(req,res)
            expect(res.send.calledOnce).to.be.true;
            
            expect(res.send.firstCall.args[0].status).to.equal(true);
            expect(res.send.firstCall.args[0].statusCode).to.equal(200);
            expect(res.send.firstCall.args[0].msg).to.equal('Wellcome main endpoint API Users Service');

            // let expectedReturn = { status: true, statusCode: 200, msg: 'Wellcome main endpoint API Users Service' }
            // assert.equal(sample,expectedReturn)
            // expect(sample).to.have.property('statusCode')

            
        });
    });
});

// test('should call res.send() with JSON', () => {
//     const send = jest.fn();
//     const res = {
//         send,
//     };
//     main.getIndex({}, res);

//     expect(send.mock.calls).toHaveLength(1);
//     expect(send.mock.calls[0][0]).toEqual({ "msg": "Wellcome main endpoint API Users Service", "status": true, "statusCode": 200 });
// });

// describe('should call list method of Todos', async () => {
//     const sandbox = sinon.createSandbox();
//     let ctx;
//     let todoList = [
//         {
//             "status": "To Do",
//             "_id": "5bd930c76044c90815d5a5c1",
//             "name": "Todo 2",
//             "description": "Description to do 2",
//             "created_at": "2018-10-31T04:34:15.538Z",
//             "__v": 0
//         },
//         {
//             "status": "Doing",
//             "_id": "5bd930f2b7d3400827ab5b36",
//             "name": "Todo 1",
//             "description": "Description to do 1",
//             "created_at": "2018-10-31T04:34:58.479Z",
//             "__v": 0
//         }
//     ]
//     beforeEach(() => {
//         ctx = {
//             TodoModel: sandbox.stub().resolves(todoList)
//         }
//     });

//     afterEach(() => {
//         sandbox.restore();
//     });

//     it('should call list data of Todo', () => {
//         let data = todo.getListTodo();
//         // expect(ctx.TodoModel).toEqual(1);
//     });

// });

// describe('route index todo controller', async () => {
//     beforeEach(() => {
//         sinon.stub(Todo, 'find')
//     })

//     afterEach(() => {
//         Todo.find.restore()
//     })

//     test('Get all Todo', () => {
//         let expectedModel = [
//             {
//                 "status": "To Do",
//                 "_id": "5bd930c76044c90815d5a5c1",
//                 "name": "Todo 2",
//                 "description": "Description to do 2",
//                 "created_at": "2018-10-31T04:34:15.538Z",
//                 "__v": 0
//             },
//             {
//                 "status": "Doing",
//                 "_id": "5bd930f2b7d3400827ab5b36",
//                 "name": "Todo 1",
//                 "description": "Description to do 1",
//                 "created_at": "2018-10-31T04:34:58.479Z",
//                 "__v": 0
//             }
//         ]



//         Todo.find.yields(null, expectedModel)
//         let req = {}
//         let res = {
//             send: sinon.stub()
//         }
//         todo.getListTodo(req, res)
//         sinon.assert.calledWith(res.send, expectedModel)
//     })
// });

// describe('Main endpoint - GET - /', () => {
//     beforeEach(() => {
//         this.get = sinon.stub(request, 'get')
//     })

//     afterEach(() => {
//         request.get.restore()
//     })

//     test('it should get response json message "Welcome to API Playcourt"', (done) => {
//         var successResponse = {
//             status: true,
//             code: 'GET-MAIN-ENDPOINT',
//             message: 'Welcome to Playcourt API'
//         }

//         var succesHttpResponse = {
//             'statusCode': 200,
//             'headers': {
//                 'content-type': 'application/json'
//             }
//         }

//         this.get.yields(null, succesHttpResponse, successResponse)

//         request.get(`${baseurl}/`, (err, res, body) => {
//             expect(res.statusCode).toBe(200)
//             expect(body).toHaveProperty('message', 'Welcome to Playcourt API')
//             expect(body).toHaveProperty('code', 'GET-MAIN-ENDPOINT')
//             expect(body).toHaveProperty('status', true)
//             expect(body).toMatchObject(successResponse)
//             done()
//         })
//     })
// })
