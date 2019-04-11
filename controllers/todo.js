const Response = require('../helpers/response')
const Todo = require('../models/todo')
const TodoSQL = require('../models/todo-sql')

const getListTodoMongo = async (req, res) => {
    try {
        let listTodo = await Todo.find({})
        if (!listTodo) {
            const error = new Error('List Todos not found.')
            error.statusCode = 404
            error.code = 'TODOS-SERVICE'
            throw error
        } else {
            Response.successResponse(res, 200, 'TODOS-SERVICE', 'Get List Todos Success.', listTodo)
        }
    } catch (error) {
        Response.failedResponse(res, error.statusCode, error.code, error.message)
    }
}

const getTodoMongo = async (req, res) => {
    try {
        let aTodo = await Todo.findById({
            _id: req.params.id
        })
        if (!aTodo) {
            Response.failedResponse(res, 404, 'TODO-SERVICE', 'Get List Todos Failed, todo not found with this id', aTodo) 
        } else {
            Response.successResponse(res, 200, 'TODOS-SERVICE', 'Get List Todos Success.', aTodo)
        }
    } catch (err) {
        const error = new Error('Get List Todos Failed.')
        error.statusCode = 400
        error.code = 'TODOS-SERVICE'
        error.err = err
        Response.failedResponse(res, error.statusCode, error.code, error.message, err.message)
    }
}

const postTodoMongo = async (req, res) => {
    try {
        let todoitem = {
            name: req.body.name,
            description: req.body.description,
            status: req.body.status
        }
        let  todo = new Todo(todoitem)
        let newTodo = await todo.save()
        Response.successResponse(res, 201, 'TODO-SERVICE', 'Post Todos Success', newTodo)
    } catch (err) {
        const error = new Error('Post Todos Failed.')
        error.statusCode = 400
        error.code = 'TODOS-SERVICE'
        error.err = err
        Response.failedResponse(res, error.statusCode, error.code, error.message, err)
    }
}

const putTodoMongo = async (req, res) => {
    try {
        let todo = await Todo.findOneAndUpdate(
            {_id: req.params.id}, 
            {$set: {name: req.body.name,description: req.body.description,status: req.body.status}
            }, {new: true})
        if (!todo) {
            Response.failedResponse(res, 404, 'TODO-SERVICE', 'Update Todos Failed, todo not found with this id', todo) 
        } else {
            Response.successResponse(res, 200, 'TODO-SERVICE', 'Update Todos Success', todo)
        }
    } catch (err) {
        const error = new Error('Update Todos Failed.')
        error.statusCode = 400
        error.code = 'TODOS-SERVICE'
        error.err = err
        Response.failedResponse(res, error.statusCode, error.code, error.message, err.message)
    }
}

const delTodoMongo = async (req, res) => {
    try {
        let todo = await Todo.findByIdAndDelete(req.params.id)
        if (!todo) {
            console.log(todo)
            Response.failedResponse(res, 400, 'TODO-SERVICE', 'Delete Todos Failed', todo)
        } else {
            Response.successResponse(res, 200, 'TODO-SERVICE', 'Delete Todos Success', todo)
        }
    } catch (err) {
        const error = new Error('Delete Todos Failed.')
        error.statusCode = 400
        error.code = 'TODOS-SERVICE'
        error.err = err
        Response.failedResponse(res, error.statusCode, error.code, error.message, err.message)
    }
}

const getListTodoSQL = async (req, res) => {
    TodoSQL.findAll({}).then(todos => {
        if (!todos) {
            Response.failedResponse(res, 404, 'TODOS-SERVICE', 'List Todos not found.')
        } else {
            Response.successResponse(res, 200, 'TODO-SERVICE', 'Get List Todos Success', todos)
        }
    }).catch(err => Response.failedResponse(res, 500, 'TODO-SERVICE', 'Error Occurred', err))
}

const getTodoSQL = async (req, res) => {
    TodoSQL.findByPk(req.params.id).then(todos => {
        if (!todos) {
            Response.failedResponse(res, 404, 'TODOS-SERVICE', 'List Todos not found.')
        } else {
            Response.successResponse(res, 200, 'TODO-SERVICE', 'Get List Todos Success', todos)
        }
    }).catch(err => Response.failedResponse(res, 500, 'TODO-SERVICE', 'Error Occurred', err))
}

const postTodoSQL = async (req, res) => {
    let {
        name,
        description,
        status,
    } = req.body

    TodoSQL.create({
        name: name,
        description: description,
        status: status,
    }).then(todo => {
        Response.successResponse(res, 201, 'TODO-SERVICE', 'Post Todos Success', todo)
    }).catch(err => {
        Response.failedResponse(res, 400, 'TODO-SERVICE', 'Post Todos Failed', err)
    })
}

const putTodoSQL = async (req, res) => {
    let id = req.params.id
    try {
        let todo = await TodoSQL.findByPk(req.params.id)
        if (!todo) {
            Response.failedResponse404(res, 'TODOS-SERVICE', 'List Todos not found.')
        } else {
            todo.update(req.body, {
                where: {
                    id: id
                }
            })
                .then(rowsUpdated => Response.successResponse(res, 202, 'TODO-SERVICE', 'Update Todos Success', rowsUpdated))
                .catch(err => Response.failedResponse(res, 500, 'TODO-SERVICE', 'Delete Todos Failed', err))
        }
    } catch (error) {
        Response.failedResponse(res, 500, 'TODO-SERVICE', 'Error Occurred', error)
    }
}

const delTodoSQL = async (req, res) => {
    try {
        let todo = await TodoSQL.findByPk(req.params.id)
        if (!todo) {
            Response.failedResponse(res, 404, 'TODOS-SERVICE', 'List Todos not found.')
        } else {
            todo.destroy().then(result => {
                Response.successResponse(res, 200, 'TODO-SERVICE', 'Delete Todos Success', result)
            }).catch(err => Response.failedResponse(res, 400, 'TODO-SERVICE', 'Delete Todos Failed', err))
        }
    } catch (error) {
        Response.failedResponse(res, 500, 'TODO-SERVICE', 'Error Occurred', error)
    }
}

module.exports = {
    getTodoMongo,
    getListTodoMongo,
    postTodoMongo,
    putTodoMongo,
    delTodoMongo,
    getTodoSQL,
    getListTodoSQL,
    postTodoSQL,
    putTodoSQL,
    delTodoSQL,
}