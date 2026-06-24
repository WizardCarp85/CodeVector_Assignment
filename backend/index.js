const express = require('express')

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
