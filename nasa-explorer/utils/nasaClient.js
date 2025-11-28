import axios from 'axios'
export default axios.create({
  baseURL: 'http://localhost:3000/',
  // baseURL: 'http://192.168.1.106:3000' Coloquei isto para testar no celular, pois localhost não funciona
})