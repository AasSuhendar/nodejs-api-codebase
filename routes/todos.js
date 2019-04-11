const express = require('express')
const router = express.Router()
const TodoController = require('../controllers/todo')
const auth = require('../helpers/auth-basic')

/**
 * @swagger
 * securityDefinitions:
 *   APIKeyHeader:
 *     type: apiKey
 *     in: header 
 *     name: Authorization
 * 
 */

/**
 * @swagger
 * definitions:
 *   Todo:
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       status:
 *         type: string
 *   ResGetAllTodos:
 *     properties:
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 *       code:
 *         type: string
 *       msg:
 *         type: string
 *       data:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Todo'
 *   ResGetOneTodos:
 *     properties:
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 *       code:
 *         type: string
 *       msg:
 *         type: string
 *       data:
 *         type: object
 *         items:
 *           $ref: '#/definitions/Todo'
 *   ResFailed:
 *     properties:
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 *       code:
 *         type: string
 *       msg:
 *         type: string
 *       error:
 *         type: object
 */

router.get('/mongo', auth.AuthMiddleware, TodoController.getListTodoMongo)
router.get('/mongo/:id', auth.AuthMiddleware, TodoController.getTodoMongo)
router.post('/mongo', auth.AuthMiddleware, TodoController.postTodoMongo)
router.put('/mongo/:id', auth.AuthMiddleware, TodoController.putTodoMongo)
router.delete('/mongo/:id', auth.AuthMiddleware, TodoController.delTodoMongo)

/**
 * @swagger
 * /api/todos/mysql:
 *   get:
 *     tags:
 *       - Todos
 *     description: Get all todos
 *     produces:
 *       - application/json
 *     security:
 *       - APIKeyHeader: []
 *     responses:
 *       200:
 *         description: Get all todos
 *         schema:
 *           $ref: '#/definitions/ResGetAllTodos'
 *       500:
 *         description: Error occurred when get the data
 *         schema:
 *           $ref: '#/definitions/ResFailed'
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Error occurred when get the data
 *         schema:
 *           $ref: '#/definitions/ResFailed'
 */
router.get('/mysql', auth.AuthMiddleware, TodoController.getListTodoSQL)

/**
 * @swagger
 * /api/todos/mysql/{id}:
 *   get:
 *     tags:
 *       - Todos
 *     description: Get one todos by id
 *     produces:
 *       - application/json
 *     security:
 *       - APIKeyHeader: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Todo ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Get one todos
 *         schema:
 *           $ref: '#/definitions/ResGetOneTodos'
 *       500:
 *         description: Error when get the data
 *         schema:
 *           $ref: '#/definitions/ResFailed'
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Error occurred when get the data
 *         schema:
 *           $ref: '#/definitions/ResFailed'
 */
router.get('/mysql/:id', auth.AuthMiddleware, TodoController.getTodoSQL)
router.post('/mysql', auth.AuthMiddleware, TodoController.postTodoSQL)
router.put('/mysql/:id', auth.AuthMiddleware, TodoController.putTodoSQL)
router.delete('/mysql/:id', auth.AuthMiddleware, TodoController.delTodoSQL)

module.exports = router