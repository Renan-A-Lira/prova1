import "reflect-metadata"

import express from 'express'
import { AppDataSource } from './db'
import { router } from './router'

import path from 'path'

require('dotenv').config({path: path.resolve(__dirname, '..', '.env')})

AppDataSource.initialize().then(() => {

})

const app = express()
const port = 3000


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(router)


app.listen(port, () => console.log('Servidor Rodando...'))
