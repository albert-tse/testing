import alt from '../alt';
import SignUpActions from '../actions/SignUp.action';

class SignUpStore {
    constructor() {
        Object.assign(this, {
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
                platform: platform,
                url: url
            });
        } else {
            return false;
        }
    }

    markProfileUrlVerified(isVerified) {
        this.profile = Object.assign({}, this.profile, {
            isVerifying: false,
            isVerified: isVerified
        });
    }
}

export default alt.createStore(SignUpStore, 'SignUpStore');
