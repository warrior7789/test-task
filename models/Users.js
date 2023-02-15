const beautifyUnique = require('mongoose-beautiful-unique-validation');

const mongoose = require('mongoose');
var dataTables = require('./datatable')
const UserSchema = mongoose.Schema({    
    email: { type: String, default: null },
    password: { type: String, default: null }
    
}, {
    timestamps: true
});

UserSchema.plugin(dataTables);

module.exports = mongoose.model('users', UserSchema);