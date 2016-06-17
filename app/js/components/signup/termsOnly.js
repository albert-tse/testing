import AltContainer from 'alt-container'
import React from 'react'
import Config from '../../config'
import TermsOnlyComponent from './termsOnly.component'
import History from '../../history'
import UserActions from '../../actions/User.action'
import UserStore from '../../stores/User.store'

class Terms extends React.Component {

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
            _.defer(() => History.push(Config.routes.default));
        }
    }

    onSubmit(e) {
        var fields = this.termsOnlyComponent.getFields();

        var isValid = true;

        isValid &= fields.legal.isValid();

        fields.legal.forceValidation();

        if (!isValid) {
            return;
        }

        var data = {
            tos_version: fields.legal.getValues().tos
        }

        UserActions.acceptTos(data);

        e.preventDefault();
    }

    render() {
        return (
            <AltContainer store={ UserStore }>
                <TermsOnlyComponent onSubmit={this.onSubmit.bind(this)} ref={(c) => this.termsOnlyComponent = c}/>
            </AltContainer>
        );
    }
}

export default Terms;
