import React from 'react';
import AltContainer from 'alt-container';
import Component from './settings.component';
import UserActions from '../../actions/User.action'
import UserStore from '../../stores/User.store';

class Settings extends React.Component {

    constructor(props) {
        super(props);
    }


    onSubmit(e) {
        var fields = this.component.getFields();

        var isValid = true;

        isValid &= fields.topics.isValid();
        isValid &= fields.email.isValid();

        fields.topics.forceValidation();
        fields.email.forceValidation();

        var data = {
            topics: fields.topics.getValue(),
            email: fields.email.getValue(),
            selectedSites: UserStore.getState().selectedSites
        }

        UserActions.updateUser(data);

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

export default Settings;
