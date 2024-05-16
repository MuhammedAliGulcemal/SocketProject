const mysql = require("mysql")

const dbConnection = mysql.createPool({//veritabani baglantisi
    connectionLimit: 100,
    host:  "sql7.freemysqlhosting.net",
    user: "sql7706994",
    password:  "xXKqklYLNM",
    database: "sql7706994",
    debug: false
});

exports.create = (req, res) => {//proje olusturma
    const { name, creator_username, userid } = req.body;
    dbConnection.query("SELECT * FROM projects WHERE name = ?", [name], (error, results) => {//o isimde proje var mi kontrol etme
        if (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }

        if (results.length > 0) {
            return res.status(400).send({ success: false, message: "Project name is already taken" });
        }
        dbConnection.query("SELECT MAX(project_key) AS max_key FROM projects", (error, result) => {//key olusturma icin en buyuk key sayisini alma
            if (error) {
                console.log(error);
                return res.status(500).send("Internal Server Error");
            }
            const maxKey = result[0].max_key || 0;

            const newKey = maxKey + 1//yeni keyi en buyuk keyin 1 fazlasi yapma
            dbConnection.query("INSERT INTO projects SET ?", { name: name, creator_username: creator_username, project_key: newKey }, (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send("Internal Server Error");
                }
                dbConnection.query("INSERT INTO hasproject SET ?", { user_ID: userid, project_ID: results.insertId }, (error, results2) => {//projeyi kaydetme
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


exports.addProject = (req, res) => {//proje ekleme
    const { projectkey, userid } = req.body;
    dbConnection.query("SELECT id FROM projects WHERE project_key = ?", [projectkey], (error, projectIDs) => {//projeninin idsini alma
        if (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }

        if (projectIDs.length === 0) {
        
            return res.status(404).send("Project not found");
        }

        const project_ID = projectIDs[0].id; 

        dbConnection.query("INSERT INTO hasproject SET ?", { user_ID: userid, project_ID: project_ID }, (error, results2) => {//projeyi userid ile ekleme
            if (error) {
                console.log(error);
                return res.status(500).send("Internal Server Error");
            }
            return res.status(200).send({ success: true, message: "Registered" });
        });
    });
};


exports.getProjects = (req, res) => {//projeleri cekme
    const username = req.params.username;
    dbConnection.query("SELECT * FROM projects WHERE creator_username = ?", [username], (error, projects) => {//projelerden olusturani alma

        if (error) {
            console.error("Error fetching projects:", error);
            return res.status(500).send("Internal Server Error");
        } else {
            dbConnection.query("SELECT * FROM user WHERE username = ?", [username], (error2, results) => {//kullaniciyi alma
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
exports.hasProjects = (req, res) => {//projede var mi kontrol
    const userid = req.params.userid;
    console.log("USER ID",userid)
    dbConnection.query("SELECT project_ID FROM hasproject WHERE user_ID = ?", [userid], (error, results) => {//projede var mi bakma
        if (error) {
            console.error("Error fetching projects:", error);
            return res.status(500).send("Internal Server Error");
        } else {
          
           const project_IDs = results.map(result => result.project_ID);
           dbConnection.query("SELECT * FROM projects WHERE id IN (?)", [project_IDs], (error2, hasProjects) => {//varsa alma
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

exports.getProjectUsers = (req, res) => {//projedeji kullanicilari alma
    const projectid = req.params.projectid; 
    console.log("Projectid:", projectid)
    dbConnection.query("SELECT user_ID FROM hasproject WHERE project_ID = ?", [projectid], (error, results) => {//projede var mi bakma
        if (error) {
            console.error("Error fetching project users:", error);
            return res.status(500).send("Internal Server Error");
        } else {
            const user_IDs = results.map(result => result.user_ID);
            if (user_IDs.length === 0) {
                return res.status(200).send({ users: [], message: "No users found for this project" });
            }
            dbConnection.query("SELECT * FROM user WHERE id IN (?)", [user_IDs], (error2, users) => {//var olanlari alma
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

