var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN', 'USER'],
    message: '{VALUE} is an invalid role'
};

var usuarioSchema = new Schema({
    name: { type: String, required: [true, 'The name is required'] },
    email: { type: String, unique: true, required: [true, 'The email is required'] },
    password: { type: String, required: [true, 'The password is required'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: 'The {PATH} is already registered' });

module.exports = mongoose.model('Usuario', usuarioSchema);