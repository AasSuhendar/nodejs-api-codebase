const todo = require('../../controllers/todo')
const Todo = require('../../models/todo')
const sinon = require('sinon')

process.env.NODE_ENV = 'test'

describe('Controllers Todo', function () {
    describe('Todo controller route /', function () {

        let TestTodo
        beforeEach(function () {
            res = {
                status: sinon.stub().returns({
                    json: sinon.spy()
                })
            };
            req = {}
            TestTodo = sinon.stub(Todo, 'find')
        });

        afterEach(() => {
            TestTodo.restore()
        })


        it('should return json Todo', function () {
            expectedResult = [{}, {}, {}]
            listTodo = [{
                    "status": "To Do",
                    "_id": "5bd930c76044c90815d5a5c1",
                    "name": "Todo 2",
                    "description": "Description to do 2",
                    "created_at": "2018-10-31T04:34:15.538Z",
                    "__v": 0
                },
                {
                    "status": "Doing",
                    "_id": "5bd930f2b7d3400827ab5b36",
                    "name": "Todo 1",
                    "description": "Description to do 1",
                    "created_at": "2018-10-31T04:34:58.479Z",
                    "__v": 0
                }
            ]
            TestTodo.returns(listTodo)
            todo.getListTodoMongo(req, res)
            sinon.assert.calledWith(TestTodo, {})
        });

        it('should not return json Todo', function () {
            listTodo = null
            TestTodo.returns(listTodo)
            todo.getListTodoMongo(req, res)
            sinon.assert.calledWith(TestTodo, {})
        });
    });
});