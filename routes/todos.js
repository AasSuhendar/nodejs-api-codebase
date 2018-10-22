var express = require('express');
var router = express.Router();
const TodoController = require('../controllers/todo')

router.get('/', TodoController.getListTodo);

module.exports = router;
