require('dotenv').config()
const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')

app.use(cors())

app.get('/today-img', async (req, res) => {
    const nasaClient = axios.create({
        baseURL: 'https://api.nasa.gov/planetary/' 
    })

    const result = await nasaClient.get('apod', {
        params: {
            api_key: process.env.NASA_KEY 
        }
    })

    res.json(result.data) 
})

app.get('/search', async (req, res) => {
    const termoBusca = req.query.termo
    const anoBusca = req.query.ano   

    const nasaSearchClient = axios.create({
        baseURL: 'https://images-api.nasa.gov' 
    })

    const result = await nasaSearchClient.get('/search', {
        params: {
            q: termoBusca,
            year_start: anoBusca,
            media_type: 'image',
            page_size: 10
        }
    })

    const fotosProcessadas = result.data.collection.items.map(item => {
        const link = item.links[0].href

        const dados = item.data[0]

        return {
            titulo: dados.title,
            link: link, 
            descricao: dados.description
        }
    })

    res.json(fotosProcessadas)
  
})

const port = 3000
app.listen(port, () => console.log(`Backend NASA rodando na porta ${port}.`))