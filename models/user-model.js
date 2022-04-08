const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        id: { type: String, required: true},
        pseudo: { type: String, required: true},
        password: { type: String, required: true},
        channels: { type: Array, required: true},
        token: { type: String, required: true}
    },
    { timestamps: true }
)

module.exports = mongoose.model('users', User)
