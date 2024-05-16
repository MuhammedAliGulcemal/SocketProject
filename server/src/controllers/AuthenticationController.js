const mysql = require("mysql")

const dbConnection = mysql.createPool({
    connectionLimit: 100,
    host:  "sql7.freemysqlhosting.net",
    user: "sql7706994",
    password:  "xXKqklYLNM",
    database: "sql7706994",
    debug: false
});


exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    dbConnection.query("SELECT * FROM user WHERE username = ? AND password = ?", [username, password], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
        if (results.length === 0) {
            return res.render("login", {
                message: "Invalid username or password"
            });
        } else {
            const result = results
            dbConnection.query("SELECT * FROM projects WHERE creator_username = ?", [username], (error, projects) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send("Internal Server Error");
                }
                console.log(results)
                res.status(200).send({
                    success: true,
                    projects: projects
                });
                
            });
        }
        
    });
};


exports.register = (req, res) => {
    try {
        console.log(req)
        const name = req.body.name
        const username = req.body.username
        const password = req.body.password

        dbConnection.query("select username from user where username = ? ", [username], (error, results) => {
            if (error) {
                console.log(error)
                return res
                    .status(200)
                    .send({ message: "Error1" });
            }
            if (results.length > 0) {
                return res
                    .status(200)
                    .send({ success: false, message: "That username is already taken" });

            }

        })

        dbConnection.query("insert into user set ? ", { name: name, username: username, password: password }, (error, results) => {
            if (error) {
                console.log(error)
                return res
                    .status(200)
                    .send({ message: "Error" });
            } else {
                return res
                    .status(200)
                    .send({ success: true, message: "Registered" });
            }
        })
    } catch (error) {
        console.log(error)
        return res
            .status(200)
            .send({ success: false, message: "Error2" });
    }

}


