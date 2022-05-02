import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'

import postRoutes from './routes/posts.js'

const app = express()
dotenv.config()

app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.use('/posts', postRoutes)

app.get('/', (req, res) => {
    res.send('Hello from habit backend')
})

// const CONNECTION_URL = 'mongodb+srv://masterDB:mongo1994@cluster0.nltrr.mongodb.net/habitsDatabase?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`servers is running on port ${PORT}`)))
    .catch((error) => console.log(error.message))