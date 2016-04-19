import React from 'react';
import UserAction from '../actions/User.action';
import UserStore from '../stores/User.store';

class SignInButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            isSignedIn: false
        };
    }

    componentDidMount() {
        gapi.signin2.render('login', {
            'scope': 'email',
            'width': 'auto',
            'height': '31px',
            'longtitle': false,
            'theme': 'dark',
            'onsuccess': UserAction.signIn,
            'onfailure': this.onSignInFailed
        });

        UserStore.listen(this.onChange.bind(this));
    }

    onChange(state) {
        this.setState({
            user: state,
            isSignedIn: Object.keys(state.googleUser).length > 0 && state.googleUser.isSignedIn()
        });
    }

    onSignInFailed(err) {
        console.error(err);
    }

    onLogout(e) {
        UserAction.signOut();
        return e.preventDefault();
    }

    render() {
        var wrapperClassName = `form-group ${this.state.isSignedIn ? 'signed-in' : 'signed-out'}`;

        return (
            <div id="login-wrapper" className={wrapperClassName}>
                <div id="login" className="btn btn-primary"></div>
                <button id="logout" className="btn btn-default" onClick={this.onLogout.bind(this)}>Sign out</button>
            </div>
        );
    }

}

export default SignInButton;
