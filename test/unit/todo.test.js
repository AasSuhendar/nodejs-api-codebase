const todo = require('../../controllers/todo')
const Todo = require('../../models/todo')
const sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect

var assert = require('assert');
describe('Controllers Index', function () {
    describe('Todo controller route /', function () {

        let TestTodo
        beforeEach(function () {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ send: sinon.spy() })
            };
            req = {}
            TestTodo = sinon.stub(Todo, 'find')
        });

        afterEach(() => {
            TestTodo.restore()
        })


        it('should return json Todo', function () {
            listTodo = [
                {
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
            todo.getListTodo(req, res)

            // sinon.assert.calledWith(Todo.find, {})
            // sinon.assert.calledWith(res.json, sinon.match.array);
        });

        it('should not return json Todo', function () {
            listTodo = null

            TestTodo.returns(listTodo)
            todo.getListTodo(req, res)

            // sinon.assert.calledWith(Todo.find, {})
            // sinon.assert.calledWith(res.json, sinon.match.array);
        });
    });
});