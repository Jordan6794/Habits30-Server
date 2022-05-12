import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]

        if(token){
            let decodedData = jwt.verify(token, process.env.SECRET_KEY)
            req.userId = decodedData?.id
        }
        next()

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error with the token' })
    }
}

export default auth