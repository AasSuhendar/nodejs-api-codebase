const Response = require('../helpers/response')
const Todo = require('../models/todo')
const TodoSQL = require('../models/todo-sql')

const getListTodoMongo = async (req, res) => {
    let listTodo = await Todo.find({})
    if (!listTodo) {
        Response.failedResponse(res, 400, 'TODOS-SERVICE', 'List Todos not found.')
    } else {
        Response.successResponse(res, 200, 'TODOS-SERVICE', 'Get List Todos Success.', listTodo)
    }
}

const getTodoMongo = async (req, res) => {
    let aTodo = await Todo.findById({
        _id: req.params.id
    })
    if (!aTodo) {
        Response.failedResponse(res, 400, 'TODOS-SERVICE', 'List Todos not found.')
    } else {
        Response.successResponse(res, 200, 'TODOS-SERVICE', 'Get List Todos Success.', aTodo)
    }
}

const postTodoMongo = async (req, res) => {
    let todoitem = {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status
    }
    var newTodo = new Todo(todoitem)
    newTodo.save((err, todo) => {
        if (err) {
            Response.failedResponse(res, 400, 'TODO-SERVICE', 'Post Todos Failed', err)
        } else {
            Response.successResponse(res, 201, 'TODO-SERVICE', 'Post Todos Success', todo)
        }
    })
}

const putTodoMongo = async (req, res) => {
    Todo.findByIdAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            name: req.body.name,
            description: req.body.description,
            status: req.body.status
        }
    }, {
        new: true
    }, (err, todo) => {
        if (err) {
            Response.failedResponse(res, 400, 'TODO-SERVICE', 'Update Todos Failed', err)
        } else {
            Response.successResponse(res, 200, 'TODO-SERVICE', 'Update Todos Success', todo)
        }
    })
}

const delTodoMongo = async (req, res) => {
    Todo.findOneAndDelete(req.params.id, (err, todo) => {
        if (err) {
            Response.failedResponse(res, 400, 'TODO-SERVICE', 'Update Todos Failed', err)
        } else {
            Response.successResponse(res, 200, 'TODO-SERVICE', 'Update Todos Success', todo)
        }
    })
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