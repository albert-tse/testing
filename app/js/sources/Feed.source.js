import alt from '../alt';
import axios from 'axios';

// TODO place in a env-controlled config file instead
var config = {
    apiUrl: 'http://geordi.dev:3000/articles'
};

var FeedSource = {
    fetchAll: function (token) {
        return axios.get(`${config.apiUrl}/?token=${token}`);
    }
};

export default FeedSource;
