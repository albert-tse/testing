import AltContainer from 'alt-container'
import React from 'react'

import Config from '../../config'
import SignUpComponent from './signup.component'
import History from '../../history'
import UserActions from '../../actions/User.action'
import UserStore from '../../stores/User.store'
import AuthActions from '../../actions/Auth.action'

class SignUp extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        UserActions.loadUser();
        UserStore.listen(this.onUserChange);
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onUserChange);
    }

    onUserChange() {
        if (UserStore.getState().user && UserStore.getState().user.tos_version == Config.curTOSVersion) {
            _.defer(() => History.push(Config.routes.success));
        }
        if (UserStore.getState().user && UserStore.getState().user.is_setup) {
            _.defer(() => History.push(Config.routes.success));
        }
    }

    logout() {
        AuthActions.deauthenticate();
        _.defer(() => History.push(Config.routes.default));
    }

    onSubmit(e) {
        e.preventDefault();

        var fields = this.signUpComponent.getFields();

        var isValid = true;

        isValid &= fields.influencerName.isValid();
        isValid &= fields.influencerUrl.isValid();
        isValid &= fields.topics.isValid();
        isValid &= fields.legal.isValid();
        isValid &= fields.email.isValid();

        fields.influencerName.forceValidation();
        fields.influencerUrl.forceValidation();
        fields.topics.forceValidation();
        fields.legal.forceValidation();
        fields.email.forceValidation();

        if (!isValid) {
            return;
        }

        var influencerUrl = fields.influencerUrl.getValue();
        var platform = 'facebook'
        if(/twitter/.test(influencerUrl)){
            platform = 'twitter';
        }
        

        var data = {
            influencer_name: fields.influencerName.getValue(),
            influencer_url: influencerUrl,
            influencer_platform: platform,
            topics: fields.topics.getValue(),
            communications: fields.legal.getValues().comms,
            tos_version: fields.legal.getValues().tos,
            email: fields.email.getValue()
        }

        UserActions.setupExternalInfluencer(data);

        return false;
    }

    render() {
        return (
            <AltContainer store={ UserStore }>
                <SignUpComponent onSubmit={this.onSubmit.bind(this)} ref={(c) => this.signUpComponent = c} onLogout={this.logout}/>
            </AltContainer>
        );
    }
}

export default SignUp;
