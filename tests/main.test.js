const main = require('../controllers/index');
const todo = require('../controllers/todo');
const sinon = require('sinon');


test('should call res.send() with JSON', () => {
    const send = jest.fn();
    const res = {
        send,
    };
    main.getIndex({}, res);
    
    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][0]).toEqual({ "msg": "Wellcome main endpoint API Users Service", "status": true, "statusCode": 200 });
});

describe('should call list method of Todos', async () => {
    const sandbox = sinon.createSandbox();
    let ctx;
    let todoList = [
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
    beforeEach(() => {
        ctx = {
            TodoModel: sandbox.stub().resolves(todoList)
        }
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call list data of Todo', () => {
        let data = todo.getListTodo();
        console.log(data);
         
        console.log(ctx.TodoModel);
        
        // expect(ctx.TodoModel).toEqual(1);
    });


});

