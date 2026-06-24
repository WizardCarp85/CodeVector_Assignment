import express from 'express';
import dotenv from 'dotenv';
import productRouter from './routes/products'

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/products',productRouter)


app.listen(PORT,()=>{
    console.log(`Server is Running on PORT ${PORT}`)
})