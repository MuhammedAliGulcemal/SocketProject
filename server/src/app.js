const express = require("express")
const cors = require('cors');
const bodyParser = require("body-parser")

const morgan = require("morgan")

const app = express()
app.use(morgan("combined"))
app.use(cors());
app.use(bodyParser.json())


app.post("/register",(req,res)=>{
    res.send({
        message:`alo ${req.body.name}registered`,
    })
})

app.listen(process.env.PORT || 8081)