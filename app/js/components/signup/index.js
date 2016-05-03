import AltContainer from 'alt-container'
import React from 'react'

import Config from '../../config'
import SignUpComponent from './signup.component'
import History from '../../history'

class SignUp extends React.Component {

    constructor(props) {
        super(props);
    }

    onSubmit(e) {
        var fields = this.signUpComponent.getFields();
        console.log(fields);

        var isValid = true;

        isValid &= fields.influencerName.isValid();
        isValid &= fields.influencerUrl.isValid();
        isValid &= fields.topics.isValid();
        isValid &= fields.legal.isValid();

        fields.influencerName.forceValidation();
        fields.influencerUrl.forceValidation();
        fields.topics.forceValidation();
        fields.legal.forceValidation();

        var data = {
            influencerName: fields.influencerName.getValue(),
            influencerUrl: fields.influencerUrl.getValue(),
            topics: fields.topics.getValue(),
            agreeToComms: fields.legal.getValues().comms,
            agreeToTOS: fields.legal.getValues().tos
        }

        e.preventDefault();
    }

    render() {
        return (
            <AltContainer>
                <SignUpComponent onSubmit={this.onSubmit.bind(this)} ref={(c) => this.signUpComponent = c}/>
            </AltContainer>
        );
    }
}

export default SignUp;
