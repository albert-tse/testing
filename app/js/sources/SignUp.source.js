import alt from '../alt';
import API from '../api';
import AuthStore from '../stores/Auth.store';
import Config from '../config';

const SignUpSource = {
    verifyProfileUrl: ({ username, platform }) => {
        const token = AuthStore.getState().token;
        return API.get(`${Config.apiUrl}/users/verify?username=${username}&platform=${platform}&token=${token}`);
    }
};

export default SignUpSource;
