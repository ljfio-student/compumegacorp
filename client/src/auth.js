import axios from "axios";

/* globals localStorage */

const tokenKeyName = 'token'
const userIdKeyName = 'userId';

export default {
    login(email, pass, cb) {
        cb = arguments[arguments.length - 1]

        if (this.getToken()) {
            if (cb) cb(true)
            this.onChange(true)
            return
        }

        this.http().post('/user/login', {
            email: email,
            password: pass,
        })
        .then(response => {
            if (response.data.authenticated) {
                localStorage.setItem(tokenKeyName, response.data.token);
                localStorage.setItem(userIdKeyName, response.data.userId);

                if (cb) cb(true)
                this.onChange(true)
            }
        })
        .catch(error => {
            if (cb) cb(false)
            this.onChange(false)
        });
    },

    getUserId() {
        return localStorage.getItem(userIdKeyName);
    },

    getToken() {
        return localStorage.getItem(tokenKeyName);
    },

    logout(cb) {
        localStorage.removeItem(tokenKeyName);
        localStorage.removeItem(userIdKeyName);

        if (cb) cb()
        this.onChange(false)
    },

    loggedIn() {
        return !!this.getToken();
    },

    onChange() { },

    getAuthHeaders() {
        return {
            'Authorization': 'Bearer ' + this.getToken(),
        };
    },

    http() {
        return axios.create({
            baseURL: 'http://localhost:8081/api',
            headers: this.getAuthHeaders(),
        });
    }
}