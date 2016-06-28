import axios from 'axios'
import Config from './config'
import History from './history.js'
import AuthStore from './stores/Auth.store'

const API = {

    get(url, params) {
        return axios.get(url, params).then((response) => {
            return this.handleResponse(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
    },

    post(url, payload) {
        return axios.post(url, payload).then((response) => {
            return this.handleResponse(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
    },

    handleResponse(response) {
        let apiVersion = response.headers['x-api-version'];
        const latestApiVersion = this.getLatestApiVersion();

        if (latestApiVersion && apiVersion !== latestApiVersion) {
            this.setLatestApiVersion(apiVersion);
            AuthStore.deauthenticate();
            History.push(Config.routes.login);
        } else {
        	this.setLatestApiVersion(apiVersion);
            return Promise.resolve(response);
        }
    },

    getLatestApiVersion() {
        if (window.sessionStorage) {
            return sessionStorage.getItem('latestApiVersion');
        }
    },

    setLatestApiVersion(version) {
        if (window.sessionStorage) {
            return sessionStorage.setItem('latestApiVersion', version);
        }
    },
}

export default API
