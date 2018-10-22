var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ToDoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'pending'
    }
})

module.exports = mongoose.model('Sample_todo', ToDoSchema)