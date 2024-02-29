require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bookRoute = require('./routes/booksRoute')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
	console.log(request)
	return response.status(234).send('Welcom to Book Store MERN project')
})

app.use('/books', bookRoute)

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log('MongoDBga ulanish hosil qilindi...')
		app.listen(process.env.PORT, () => {
			console.log(`App is listening to port: ${process.env.PORT}`)
		})
	})
	.catch(err => {
		console.log("MongoDbga ulanishda xatolik ro'y berdi", err)
	})
