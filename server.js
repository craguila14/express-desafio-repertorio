const express = require('express')
const fs = require('fs')

const port = 5000

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/canciones', (req, res) => {
    try {
        const cancion = req.body
        const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'))
        canciones.push(cancion)
        fs.writeFileSync('repertorio.json', JSON.stringify(canciones))
        res.status(201).send('Cancion creada con exito')
    } catch (error) {
        res.status(500).json({message: "Algo salió mal" + error})
    }
})

app.get('/canciones', (req, res) => {
   try {
     const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'))
     res.status(200).json(canciones)
   } catch (error) {
    res.status(500).json({message: 'El recurso no esta disponible'})
   }
})

app.put("/canciones/:id", (req, res) => {
    try {
        const { id } = req.params
        const {titulo, artista, tono} = req.body
        const canciones = JSON.parse(fs.readFileSync("repertorio.json"))
        const index = canciones.findIndex(c => c.id == id)
        canciones[index] = {id, titulo, artista, tono}
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones))
        res.send("Canción modificada con éxito")
    } catch (error) {
        res.status(500).json({message: 'Algo salió mal'})
    }
})


app.delete("/canciones/:id", (req, res) => {
    try {
        const { id } = req.params
        const canciones = JSON.parse(fs.readFileSync("repertorio.json"))
        const index = canciones.findIndex(c => c.id == id)
        canciones.splice(index, 1)
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones))
        res.send("Canción eliminada con éxito")
    } catch (error) {
        res.status(500).json({message: 'Algo salió mal'})
    }
})

app.all("*", (req, res) => {
    res.status(404).send('Ruta no encontrada')
})

app.listen(port, console.log(`Server on http://localhost:${port}`))
