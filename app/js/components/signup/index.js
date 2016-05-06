import AltContainer from 'alt-container'
import React from 'react'

import Config from '../../config'
import SignUpComponent from './signup.component'
import History from '../../history'
import UserActions from '../../actions/User.action'
import UserStore from '../../stores/User.store'

class SignUp extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        UserStore.listen(this.onUserChange);
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onUserChange);
    }

    onUserChange() {
        if (UserStore.getState().user && UserStore.getState().user.tos_version == Config.curTOSVersion) {
            History.push(Config.routes.default);
        }
    }

    onSubmit(e) {
        var fields = this.signUpComponent.getFields();

        var isValid = true;

        isValid &= fields.influencerName.isValid();
        isValid &= fields.influencerUrl.isValid();
        isValid &= fields.topics.isValid();
        isValid &= fields.legal.isValid();

        fields.influencerName.forceValidation();
        fields.influencerUrl.forceValidation();
        fields.topics.forceValidation();
        fields.legal.forceValidation();
        fields.email.forceValidation();

        var data = {
            influencer_name: fields.influencerName.getValue(),
            influencer_url: fields.influencerUrl.getValue().url,
            influencer_platform: fields.influencerUrl.getValue().platform,
            topics: fields.topics.getValue(),
            communications: fields.legal.getValues().comms,
            tos_version: fields.legal.getValues().tos,
            'email': fields.email.getValue()
        }

        UserActions.setupExternalInfluencer(data);

        e.preventDefault();
    }

    render() {
        return (
            <AltContainer store={ UserStore }>
                <SignUpComponent onSubmit={this.onSubmit.bind(this)} ref={(c) => this.signUpComponent = c}/>
            </AltContainer>
        );
    }
}

export default SignUp;
