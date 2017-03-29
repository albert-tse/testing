import axios from 'axios'
import Config from './config'
import History from './history.js'
import AuthStore from './stores/Auth.store'
import Raven from 'raven-js';

const API = {

    get(url, params) {
        return axios.get(url, params).then((response) => {
            return this.handleResponse(response);
        }).catch((error) => {
            if (Raven) {
                if (error && error.data && error.data.status_txt) {
                    Raven.captureException(new Error(error.data.status_txt));
                } else {
                    Raven.captureException(error);
                }
            }

            return Promise.reject(error);
        });
    },

    post(url, payload) {
        return axios.post(url, payload).then((response) => {
            return this.handleResponse(response);
        }).catch((error) => {
            if (Raven) {
                if (error && error.data && error.data.status_txt) {
                    Raven.captureException(new Error(error.data.status_txt));
                } else {
                    Raven.captureException(error);
                }
            }

            return Promise.reject(error);
        });
    },

    put(url, payload) {
        return axios({
            method: 'put',
            url: url,
            data: payload
        })
        .then(::this.handleResponse)
        .catch((error) => {
            if (Raven) {
                if (error && error.data && error.data.status_txt) {
                    Raven.captureException(new Error(error.data.status_txt));
                } else {
                    Raven.captureException(error);
                }
            }

            return Promise.reject(error);
        });
    },

    delete(url, params) {
        return axios.delete(url, params).then((response) => {
            return this.handleResponse(response);
        }).catch((error) => {

            if (Raven) {
                if (error && error.data && error.data.status_txt) {
                    Raven.captureException(new Error(error.data.status_txt));
                } else {
                    Raven.captureException(error);
                }
            }

            return Promise.reject(error);
        });
    },

    handleResponse(response) {
        let apiVersion = response.headers['x-api-version'];
        const latestApiVersion = this.getLatestApiVersion();

        if (latestApiVersion && this.checkUserShouldLogOut(latestApiVersion, apiVersion)) {
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

    checkUserShouldLogOut(userAppVersion, currentAppVersion) {
        // Expect versions to be like 0.0.0 ([major].[minor].[hotfix])
        let userVersionParts = userAppVersion.split('.');
        let currentVersionParts = currentAppVersion.split('.');

        let userShouldLogOut = false;

        // Make sure we have at least two parts to check for each
        if (userVersionParts.length >= 2 && currentVersionParts.length >= 2) {

            // Check major version
            if (userVersionParts[0] !== currentVersionParts[0]) {
                userShouldLogOut = true;
            }

            // Check minor version
            if (userVersionParts[1] !== currentVersionParts[1]) {
                userShouldLogOut = true;
            }
        }

        return userShouldLogOut;
    }
}

export default API
