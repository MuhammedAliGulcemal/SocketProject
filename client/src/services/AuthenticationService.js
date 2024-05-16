import Api from "@/services/Api"

export default {//backend ile iletisim
    register(credentials) {
        return Api().post("register", credentials)
    },
    login(credentials) {
        return Api().post("login", credentials)
    },
    
}

