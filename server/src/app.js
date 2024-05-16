const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mysql = require("mysql");

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());

require("./routes")(app);

const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

const io = socket(server);
var userIdList = []
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
   
    socket.on("message", (msg) => {
        console.log("Message received:", msg);
        io.emit("message", msg);
    });

    socket.on("broadcast message", (msg) => {
        console.log("Broadcast message received:", msg);
        socket.broadcast.emit("broadcast message", msg);
    });
    socket.on("online", (userid) => {
        console.log(userid)
        userIdList.push(userid)
        io.emit("onlineList",userIdList)
    });
    socket.on('file', (data) => {
        const fileData = data.file;
        const fileName = data.fileName;
        io.emit('fileDownload', {
            file: fileData,
            fileName: fileName
        });
    });

    socket.on("disconnect", (userid) => {
        console.log("A user disconnected:", userid);
        userIdList = userIdList.filter(id => id !== userid);
        
    });
});

const dbConnection = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "socket",
    debug: false,
});

dbConnection.getConnection((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("MySQL Connected");
});

module.exports = dbConnection;
