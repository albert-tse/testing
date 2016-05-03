import AltContainer from 'alt-container'
import React from 'react'

import Config from '../../config'
import SignUpComponent from './signup.component'
import History from '../../history'

class SignUp extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer>
                <SignUpComponent />
            </AltContainer>
        );
    }
}

export default SignUp;
