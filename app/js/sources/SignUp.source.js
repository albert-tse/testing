import alt from '../alt';
import API from '../api';
import AuthStore from '../stores/Auth.store';
import Config from '../config';

const SignUpSource = {
    verifyProfileUrl: ({ username, platform }) => {
        const token = AuthStore.getState().token;
        return API.get(`${Config.apiUrl}/users/verify?username=${username}&platform=${platform}&token=${token}`).catch(err => {
            console.log(err.data.profile_exists);
            if (!err.data.profile_exists) {
                return Promise.reject("Sorry, we couldn't view your profile. Please verify the URL.");
            }
        });
    }
};

export default SignUpSource;
