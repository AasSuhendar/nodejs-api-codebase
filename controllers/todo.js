const Response = require('../helpers/response')
const Todo = require('../models/todo')

const getListTodo = async (req, res) => {
    // let todo = {
    //     "status": "Doing",
    //     "name": "Todo 1",
    //     "description": "Description to do 1",
    // }
    // let TodoNew = new Todo(todo)
    // TodoNew.save(err => {
    //     if (err) {
    //         console.log(err);
    //     }else{
    //         console.log('Saved');
    //     }
    // })

    let listTodo = await Todo.find({})
    console.log(listTodo);
    
    if (!listTodo) {
        Response.failedResponse403(req, res, 'TODOS-SERVICE', 'List Todos not found.')
    } else {
        Response.successResponse200(req, res, 'TODOS-SERVICE', 'Get List Todos Success.', listTodo)
    }
}

module.exports = {
    getListTodo
}