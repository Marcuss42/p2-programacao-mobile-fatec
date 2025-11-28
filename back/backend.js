require('dotenv').config()
const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')

app.use(cors())

app.get('/img', async (req, res) => {
  
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


const port = 3000
app.listen(port, () => console.log(`Backend NASA rodando na porta ${port}.`))