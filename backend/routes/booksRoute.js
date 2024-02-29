const express = require('express')
const Joi = require('joi')
const Book = require('../models/bookModel')
const router = express.Router()

// Route for save a new Book
router.post('/', async (request, response) => {
	try {
		const { error } = bookValidate(request.body)
		if (error) {
			return response.status(400).send(error.details[0].message)
		}
		const newBook = new Book({
			title: request.body.title,
			author: request.body.author,
			publishYear: request.body.publishYear,
		})
		const book = await newBook.save()
		response.status(201).send(book)
	} catch (error) {
		console.log(error.message)
		response.status(500).send({ message: error.message })
	}
})

// Route for Get All Books from database
router.get('/', async (request, response) => {
	try {
		const books = await Book.find({})
		return response.status(200).send({
			count: books.length,
			data: books,
		})
	} catch (error) {
		console.log(error.message)
		response.status(500).send({ message: error.message })
	}
})

// Route for Get All Books from database by id
router.get('/:id', async (request, response) => {
	try {
		const id = request.params.id
		const book = await Book.findById(id)
		if (!book) {
			return response.status(404).send('Book not found')
		}
		return response.status(200).send(book)
	} catch (error) {
		console.log(error.message)
		response.status(500).send({ message: error.message })
	}
})

// Route for Update Book
router.put('/:id', async (request, response) => {
	try {
		const { error } = bookValidate(request.body)
		if (error) {
			return response.status(400).send(error.details[0].message)
		}

		const { id } = request.params
		const result = await Book.findByIdAndUpdate(id, request.body)

		if (!result) {
			return response.status(404).send('Book not found')
		}
		return response.status(200).send({ message: 'Book updated successfully' })
	} catch (error) {
		console.log(error.message)
		response.status(500).send({ message: error.message })
	}
})

// Route for Delete Book
router.delete('/:id', async (request, response) => {
	try {
		const { id } = request.params
		const result = await Book.findByIdAndDelete(id)

		if (!result) {
			return response.status(404).send('Book not found')
		}

		return response.status(200).send({ message: 'Book delete successfully' })
	} catch (error) {
		console.log(error.message)
		response.status(500).send({ message: error.message })
	}
})

// Validate Book
function bookValidate(book) {
	const bookSchema = Joi.object({
		title: Joi.string().required(),
		author: Joi.string().required(),
		publishYear: Joi.number().required(),
	})
	return bookSchema.validate(book)
}

module.exports = router
