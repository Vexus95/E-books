import express from 'express'

import { getAuthor, getAuthors, createAuthor } from './database.js';

const app = express();
const port = process.env.PORT || 5000

app.use(express.json())

app.get("/authors", async (req, res) =>{
    const authors = await getAuthors()
    res.send(authors)
})

app.get("/authors/:id", async (req, res) =>{
    const id = req.params.id
    const author = await getAuthor(id)
    res.send(author)
})

app.post("/authors", async (req, res) => {
    const { Author_Name, Author_Surname} = req.body
    const author = await createAuthor(Author_Name, Author_Surname)
    req.status(201).send(author)
})

app.use((err, req, res, next) =>{
    console.error(err.stack)
    res.status(500).send("Erreur !")
})

app.listen(port, () => {
    console.log("Serveur en ligne !")
})