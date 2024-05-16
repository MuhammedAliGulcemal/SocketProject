import Api from "@/services/Api"

export default {
    create(credentials) {
        return Api().post("create", credentials)
    },
    getProjects(username) {
        return Api().get(`projects/${username}`)
    },
    hasProjects(userid) {
        return Api().get(`hasprojects/${userid}`)
    },
    addProject(credentials) {
        return Api().post("addProject", credentials)
    },
    getProjectUsers(projectId) {
        return Api().get(`getProjectUsers/${projectId}`);
    }

}
