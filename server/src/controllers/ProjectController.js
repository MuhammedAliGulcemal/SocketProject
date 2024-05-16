const mysql = require("mysql")

const dbConnection = mysql.createPool({
    connectionLimit: 100,
    host:  "sql7.freemysqlhosting.net",
    user: "sql7706994",
    password:  "xXKqklYLNM",
    database: "sql7706994",
    debug: false
});

exports.create = (req, res) => {
    const { name, creator_username, userid } = req.body;
    dbConnection.query("SELECT * FROM projects WHERE name = ?", [name], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }

        if (results.length > 0) {
            return res.status(400).send({ success: false, message: "Project name is already taken" });
        }
        dbConnection.query("SELECT MAX(project_key) AS max_key FROM projects", (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send("Internal Server Error");
            }
            const maxKey = result[0].max_key || 0;

            const newKey = maxKey + 1
            dbConnection.query("INSERT INTO projects SET ?", { name: name, creator_username: creator_username, project_key: newKey }, (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send("Internal Server Error");
                }
                dbConnection.query("INSERT INTO hasproject SET ?", { user_ID: userid, project_ID: results.insertId }, (error, results2) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send("Internal Server Error");
                    } else {
                        return res.status(200).send({ success: true, message: "Registered" });
                    }

                });

            });
        });
    });
};


exports.addProject = (req, res) => {
    const { projectkey, userid } = req.body;
    dbConnection.query("SELECT id FROM projects WHERE project_key = ?", [projectkey], (error, projectIDs) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }

        if (projectIDs.length === 0) {
        
            return res.status(404).send("Project not found");
        }

        const project_ID = projectIDs[0].id; 

        dbConnection.query("INSERT INTO hasproject SET ?", { user_ID: userid, project_ID: project_ID }, (error, results2) => {
            if (error) {
                console.log(error);
                return res.status(500).send("Internal Server Error");
            }
            return res.status(200).send({ success: true, message: "Registered" });
        });
    });
};


exports.getProjects = (req, res) => {
    const username = req.params.username;
    dbConnection.query("SELECT * FROM projects WHERE creator_username = ?", [username], (error, projects) => {

        if (error) {
            console.error("Error fetching projects:", error);
            return res.status(500).send("Internal Server Error");
        } else {
            dbConnection.query("SELECT * FROM user WHERE username = ?", [username], (error2, results) => {
                if(error2){
                    console.error("Error fetching projects:", error2);
                    return res.status(500).send("Internal Server Error");
                }else{
                    res.status(200).send({ projects: projects, message: "getProjects",results:results });
                }
            })
        }
    });
};
exports.hasProjects = (req, res) => {
    const userid = req.params.userid;
    console.log("USER ID",userid)
    dbConnection.query("SELECT project_ID FROM hasproject WHERE user_ID = ?", [userid], (error, results) => {
        if (error) {
            console.error("Error fetching projects:", error);
            return res.status(500).send("Internal Server Error");
        } else {
          
           const project_IDs = results.map(result => result.project_ID);
           dbConnection.query("SELECT * FROM projects WHERE id IN (?)", [project_IDs], (error2, hasProjects) => {
                if(error2){
                    console.error("Error fetching projects:", error2);
                    return res.status(500).send("Internal Server Error");
                } else {
                    res.status(200).send({ hasProjects: hasProjects, message: "hasProjects" });
                }
                
            })
        }

    });
};

exports.getProjectUsers = (req, res) => {
    const projectid = req.params.projectid; 
    console.log("Projectid:", projectid)
    dbConnection.query("SELECT user_ID FROM hasproject WHERE project_ID = ?", [projectid], (error, results) => {
        if (error) {
            console.error("Error fetching project users:", error);
            return res.status(500).send("Internal Server Error");
        } else {
            const user_IDs = results.map(result => result.user_ID);
            if (user_IDs.length === 0) {
                return res.status(200).send({ users: [], message: "No users found for this project" });
            }
            dbConnection.query("SELECT * FROM user WHERE id IN (?)", [user_IDs], (error2, users) => {
                if (error2) {
                    console.error("Error fetching users:", error2);
                    return res.status(500).send("Internal Server Error");
                } else {
                    res.status(200).send({ users: users, message: "getProjectUsers" });
                }
            })
        }
    });
};

