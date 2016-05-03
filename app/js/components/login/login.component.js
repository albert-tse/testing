import React from 'react'
import { Header, Facebook } from '../shared/index'

class LoginComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    renderAuthOptions() {
        return (
            <div id="auth-options">
                { _.map(this.props.authTypes, function(el){
                    return <button onClick={ el.action } key={ el.text } className="btn btn-default btn-lg btn-block">{ el.text }</button>
                }) }
            </div>
        );
    }

    renderErrorMessage() {
        if (this.props.authError) {
            var errorMessage =
                'Sorry, but we have encountered an error attemping to log you in.' +
                ' Please try again. For further support please contact support@the-social-edge.com';

            if (this.props.authError.error_code == 'user_not_found') {
                errorMessage =
                    'Sorry, but we could not find that account. Please try again, or create and account' +
                    ' For further support please contact support@the-social-edge.com';
            }

            return (
                <div id="error-message">
                    { errorMessage }
                </div>
            );
        }
    }

    renderModalBackdrop() {
        var classNames = 'modal-backdrop ';

        if (this.props.authenticating) {
            classNames += ' fade in';
        } else {
            classNames += ' hidden';
        }

        return (
            <div className={ classNames }></div>
        );
    }

    render() {
        return (
            <div id='app'>
                <Facebook />
                <Header />
                <div className="container">
                    <div className="jumbotron">
                        <h2>Login / Signup</h2>
                        <p>
                            Select on of the options below to sign in. Don't have an account? Just log in with any of the accounts below, and we will make one for you.
                        </p>
                        { this.renderAuthOptions() }
                        { this.renderErrorMessage() }
                    </div>
                </div>
                { this.renderModalBackdrop() }
            </div>
        );
    }
}

export default LoginComponent;
