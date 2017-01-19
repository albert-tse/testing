import React from 'react';
import AltContainer from 'alt-container';
import Component from './connect.component';
import UserActions from '../../actions/User.action'
import UserStore from '../../stores/User.store';

class ConnectAccounts extends React.Component {

    constructor(props) {
        super(props);
    }


    onSubmit(e) {
        e.preventDefault();
    }

    render() {
        return (
            <AltContainer store={ UserStore }>
                <Component onSubmit={this.onSubmit.bind(this)} ref={(c) => this.component = c}/>
            </AltContainer>
        );
    }
}

export default ConnectAccounts;
