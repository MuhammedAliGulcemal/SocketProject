import axios from "axios"

export default () => {
    return axios.create({
        baseURL: "https://socketproject.onrender.com"
    });
};
