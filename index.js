const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('VogueVault web server is running like neuron!!')
})



app.listen(port,()=>{
    console.log(`My port is running on: ${port}`);
})