const beautifyUnique = require('mongoose-beautiful-unique-validation');

const mongoose = require('mongoose');
var dataTables = require('./datatable')
const TaskSchema = mongoose.Schema({  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },  
    task: { type: String, default: null },
    status: { type: String, default: null },
    order: { type: Number, default: 0 },
    date: { type: Date, default: null }
    
}, {
    timestamps: true
});

TaskSchema.plugin(dataTables);

module.exports = mongoose.model('tasks', TaskSchema);