module.exports = {
    port:process.env.PORT || 8081,
    db:{
        database:process.env.DB_NAME || "socket",
        user:process.env.DB_USER || "root",
        password:process.env.PASS || "socket",
        options:{
            dialect:process.env.DIALECT||"sqlite",
            host: process.env.HOST||"localhost",
            storage:"./socket.sqlite"
        }
    }
}