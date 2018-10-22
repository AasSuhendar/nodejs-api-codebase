const Response = require('../helpers/response')
const JWT = require('../helpers/jwt')
const utils = require('../helpers/utils')

const Todo = require('../models/todo')

const getListTodo = async (req, res) => {
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