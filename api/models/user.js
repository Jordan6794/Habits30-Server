import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: {type: String, required: false},
    habits: Array,
    hasOnboarded: Boolean
})

const User = mongoose.model('User', UserSchema)

export default User