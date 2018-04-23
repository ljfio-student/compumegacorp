import axios from "axios";

/* globals localStorage */

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
                localStorage.setItem('token', response.data.token);
                if (cb) cb(true)
                this.onChange(true)
            }
        })
        .catch(error => {
            if (cb) cb(false)
            this.onChange(false)
        });
    },

    getToken() {
        return localStorage.getItem('token');
    },

    logout(cb) {
        localStorage.removeItem('token');
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