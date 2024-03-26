const express = require('express')
const router = express.Router()
const Book = require('../models/books.model')

const getbook = async (req,res,next) => {
    let book;
    const { id } = req.params

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message:'EL ID DE LIBRO NO ES VALIDO'
        })
    }

    try {
        book = await Book.findById(id)
        if (!book) {
            return res.status(404).json({
                message:'EL LIBRO NO FUE ENCONTRADO'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
    res.book = book;
    next()
}

// obtener todos lo libros
router.get('/', async (req,res) => {
    try {
        const books = await Book.find()
        console.log('get all',books)
        if (books.length === 0) {
           return res.status(204).json([])
        }
        res.json(books)
    } catch {   
        res.status(500).json({message:error.message})
    }  
})

router.post('/', async(req,res) => {
    const { title, author, genre, publication_date } = req?.body
    if (!title || !author || !genre || !publication_date) {
        return res.status(400).json({
            message:'Los campos titulo autor genero publicacion son obrigatorios'
        })
    }
    const book = new Book({
        title,
        author,
        genre,
        publication_date
    })

    try {
        const newbook = await book.save()
        console.log(newbook)
        res.status(201).json(newbook)
    } catch(error) {
        res.status(400).json({
            message:error.message
        })
    }

})

router.get('/:id', getbook, async (req,res) => {
    res.json(res.book)
})

router.put('/:id', getbook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.patch('/:id', getbook, async (req, res) => {

    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date) {
        res.status(400).json({
            message: 'Al menos uno de estos campos debe ser enviado: Título, Autor, Género o fecha de publicación'
        })

    }
    
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)
        
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.delete('/:id', getbook, async (req,res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id:book._id
        });
        res.json({
            message:`El libro ${book.title} fue eliminado correctamente`
        })
    } catch(error) {
        res.status(500).json({
            message:error.message
        })
    }
})
module.exports = router