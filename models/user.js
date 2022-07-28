import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    habits: Array,
})

const User = mongoose.model('User', UserSchema)

export default User