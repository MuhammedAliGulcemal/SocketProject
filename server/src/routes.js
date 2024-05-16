const AuthenticationController = require("./controllers/AuthenticationController")
const ProjectController = require("./controllers/ProjectController")

module.exports = (app) => {
    app.post("/register",
        AuthenticationController.register
    )
    app.post("/login",
        AuthenticationController.login
    )
    app.post("/create",
        ProjectController.create
    )
    app.get("/projects/:username",
        ProjectController.getProjects

    )
    app.get("/hasprojects/:userid",
        ProjectController.hasProjects

    )
    app.post("/addProject",
        ProjectController.addProject
    )
    app.get("/getProjectUsers/:projectid",
        ProjectController.getProjectUsers);




}