import axios from "axios"

export default () => {//baseurl koyma
    return axios.create({
        baseURL: "https://socketproject.onrender.com"
    });
};
