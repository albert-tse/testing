import alt from '../alt';
import SignUpActions from '../actions/SignUp.action';

class SignUpStore {
    constructor() {
        Object.assign(this, {
            isValid: false,
            profile: { // TODO: convert this to a record
                url: '',
                platform: '',
                error: false,
                isVerifying: false,
                isVerified: false
            }
        });

        this.bindActions(SignUpActions);
    }

    verifyProfileUrl({ url, platform }) {
        const shouldVerify = this.profile.url !== url;

        if (shouldVerify) {
            // show loading icon to indicate that it is verifying profile url
            this.profile = Object.assign({}, this.profile, {
                isVerifying: true,
                isVerified: false,
                error: false,
                platform: platform,
                url: url
            });
        } else {
            return false;
        }
    }

    markProfileUrlVerified(payload) {
        this.profile = Object.assign({}, this.profile, payload, {
            isVerifying: false
        });
    }
}

export default alt.createStore(SignUpStore, 'SignUpStore');
