import React, { Component } from 'react'
import { Header, Facebook } from '../shared/index'
import Analytics from '../shared/Analytics.component';
import Styles from './styles';
import _ from 'lodash';
import qs from 'querystring';
import classnames from 'classnames';
import { container, jumbotron, overlay, scrollable, vertical } from '../common';
import History from '../../history';
import Config from '../../config';

class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.AuthOptions = this.AuthOptions.bind(this);
    }

    render() {
        console.log(this.props);
        return (
            <div id="login" className={classnames(Styles.sendToBack, scrollable, vertical)}>
                <Facebook />
                <Analytics />
                <h1 className={Styles.brand}>Contempo</h1>
                <h2 className={Styles.heading}>Sign In</h2>
                <this.AuthOptions />
                <p className={Styles.message}>Not yet a member? <a href="//thesocialedge.co" target="_blank">Learn about Contempo</a></p>
                <footer>
                    <p className={Styles.disclaimer}>
                        BY CREATING AN ACCOUNT, YOU ACKNOWLEDGE THAT YOU HAVE<br />
                        READ AND ACCEPT THE SOCIAL EDGE’S <strong>TERMS OF SERVICE AND PRIVACY POLICY</strong>
                    </p>
                </footer>
                { this.renderErrorMessage() }
                { this.renderModalBackdrop() }
            </div>
        );
    }

    AuthOptions() {
        return (
            <div id="auth-options" className={Styles.authOptions}>
                {this.props.authTypes.map(el => (
                    <a
                        onClick={this.login.bind(this, el)}
                        key={el.text}
                        className={classnames(Styles.socialIcons, el.text.toLowerCase())}>
                        <i className={classnames('fa fa-' + el.text.toLowerCase(), Styles.icon)}></i>
                        <span>Continue with {el.text}</span>
                    </a>
                ))}
            </div>
        );
    }

    renderErrorMessage() {
        if (this.props.error_code || this.props.authError) {
            return (
                <p id="error-message" className="bg-danger">
                    <div>
                        <p>
                            Sorry, but we have encountered an error attempting to log you in. One common reason for
                            this is that you attempted to login with a different social platform than the one you
                            signed up with. Please try again using the original platform you used to sign up.
                        </p>
                        <p>
                            Thank you!
                        </p>
                        <p>
                            For further support please contact support@the-social-edge.com. { this.props.hash ? `Support Code: ${this.props.hash}` : '' }
                        </p>
                    </div>
                </p>
            );
        }
    }

    renderModalBackdrop() {
        let classNames = 'modal-backdrop ';

        if (this.props.authenticating) {
            classNames += ' fade in';
        } else {
            classNames += ' hidden';
        }

        return (
            <div className={classnames('modal-backdrop', this.props.authenticating ? 'fade in' : 'hidden')}></div>
        );
    }

    /**
     * Log in via the specified auth option
     * @param {Element} el the HTMLElement of the auth option
     */
    login(el) {
        const role = this.props.route_state;
        let query = window.location.hash.split('?');
        query = query.length > 1 ? query[1] : '';
        query = qs.parse(query);

        if (query.ref) {
            el.action(this.props.route_state,query.ref)
        } else {
            el.action(this.props.route_state,'unreferred')
        }
    }


}

export default LoginComponent;
