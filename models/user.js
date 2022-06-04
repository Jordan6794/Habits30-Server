import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    habits: Array,
    finished_habits: Array
})

const User = mongoose.model('User', UserSchema)

export default User

export const publicAccountId = '627d1c813e0142f3977b1a40'