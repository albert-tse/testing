import alt from '../alt';
import axios from 'axios';
import UserAction from '../actions/User.action';

// TODO place in a env-controlled config file instead
var config = {
    apiUrl: 'http://geordi.dev:3000'
};

var AuthSource = {
    authenticate: function (googleAccessToken) {
        return axios.get(`${config.apiUrl}/auth/google/token?access_token=${googleAccessToken}`);
    }
};

export default AuthSource;
