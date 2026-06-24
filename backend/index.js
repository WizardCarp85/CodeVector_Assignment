import express from 'express';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js'

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/products',productsRouter)


app.listen(PORT,()=>{
    console.log(`Server is Running on PORT ${PORT}`)
})