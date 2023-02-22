const beautifyUnique = require('mongoose-beautiful-unique-validation');

const mongoose = require('mongoose');
var dataTables = require('./datatable')
const MessageSchema = mongoose.Schema({  
    
    message: { type: String, default: null }
    
}, {
    timestamps: true
});

MessageSchema.plugin(dataTables);

module.exports = mongoose.model('message', MessageSchema);