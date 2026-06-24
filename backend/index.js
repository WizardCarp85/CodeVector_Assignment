import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// app.use('/products',require("./routes/products"))

// temporary
app.get("/",(req,res)=>{
    res.send("Server Started")
})

app.listen(PORT,()=>{
    console.log(`Server is Running on PORT ${PORT}`)
})