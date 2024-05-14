const express = require("express")
const bodyParser = require("body-parser")

const morgan = require("morgan")

const app = express()
app.use(morgan("combined"))
app.use(bodyParser.json())


app.get("/status",(req,res)=>{
    res.send({
        message:"deneme2"
    })
})

app.listen(process.env.PORT || 8081)