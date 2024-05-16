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

const io = socket(server); //socket programlamanin ve iletisimin oldugu yer
var userIdList = []
io.on("connection", (socket) => {//baglantiyi saglama
    console.log("A user connected:", socket.id);
   
    socket.on("message", (msg) => {//mesaj alma verme
        console.log("Message received:", msg);
        io.emit("message", msg);
    });

    socket.on("broadcast message", (msg) => {//broadcast mesaj gonderme
        console.log("Broadcast message received:", msg);
        socket.broadcast.emit("broadcast message", msg);
    });
    socket.on("online", (userid) => {//online kullanicilarin idleri alma
        console.log(userid)
        userIdList.push(userid)
        io.emit("onlineList",userIdList)
    });
    socket.on('file', (data) => {//dosyayi alma ve gonderme
        const fileData = data.file;
        const fileName = data.fileName;
        io.emit('fileDownload', {
            file: fileData,
            fileName: fileName
        });
    });

    socket.on("disconnect", (userid) => {//cikan kullanicilar
        console.log("A user disconnected:", userid);
        userIdList = userIdList.filter(id => id !== userid);
        
    });
});

const dbConnection = mysql.createPool({//veritabani baglantisinin oldugu yer
    connectionLimit: 100,
    host: process.env.DB_HOST || "sql7.freemysqlhosting.net",
    user: process.env.DB_USER || "sql7706994",
    password: process.env.DB_PASSWORD || "xXKqklYLNM",
    database: process.env.DB_NAME || "sql7706994",
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
