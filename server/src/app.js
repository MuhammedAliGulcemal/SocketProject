const express = require("express")
const cors = require('cors');
const bodyParser = require("body-parser")
const morgan = require("morgan")
const {sequelize} = require("./models")
const config = require("./config/config")
const app = express()
app.use(morgan("combined"))
app.use(cors());
app.use(bodyParser.json())


require("./routes")(app)

sequelize.sync().then(()=>{

    app.listen(config.port)
    console.log(`Server started on port ${config.port}`)
})

