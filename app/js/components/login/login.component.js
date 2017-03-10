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
import { gup } from '../../utils';

class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.AuthOptions = this.AuthOptions.bind(this);
        this.ErrorMessage = this.ErrorMessage.bind(this);
    }

    render() {
        return (
            <div className={Styles.center}>
                <div id="login" className={classnames(Styles.sendToBack, scrollable, vertical)}>
                    <Facebook />
                    <Analytics />
                    <h1 className={Styles.brand}>Contempo</h1>
                    <this.Heading role={this.props.route_state} />
                    <this.ErrorMessage />
                    <this.AuthOptions />
                    <p className={Styles.message}>Not yet a member? <a href="//thesocialedge.co" target="_blank">Learn about Contempo</a></p>
                    <footer>
                        <p className={Styles.disclaimer}>
                            BY CREATING AN ACCOUNT, YOU ACKNOWLEDGE THAT YOU HAVE<br />
                            READ AND ACCEPT THE SOCIAL EDGE’S <a href="//the-social-edge.com/terms-of-service/" target="_blank">TERMS OF SERVICE</a> AND <a href="//the-social-edge.com/privacy-policy/" target="_blank">PRIVACY POLICY</a>
                        </p>
                    </footer>
                    { this.renderModalBackdrop() }
                </div>
            </div>
        );
    }

    /**
     * Display the appropriate copy depending on the role defined in URL
     * If no role passed, then it's login
     * Otherwise they are signing up as either Influencer or Publisher
     * @param {Object} props contains a property called role, which defines user type
     * @return {JSDOM}
     */
    Heading(props) {
        if (props.role && props.role !== 'undefined') {
            const role = props.role[0].toUpperCase() + props.role.slice(1);
            const oppositeRole = /influencer/i.test(role) ? 'publisher' : 'influencer';
            const referral = gup('ref', window.location.href);
            return (
                <header className={Styles.signUpContainer}>
                    <h2 className={Styles.heading}>
                        Sign up as a{/influencer/i.test(role) && 'n'} <strong>{role}</strong>
                        <small className={Styles.otherLoginOption}>Are you a{/influencer/i.test(role) && 'n'} {oppositeRole}? <a href={`/#/login/${oppositeRole}?ref=${referral}`}>Sign up here</a></small>
                    </h2>
                </header>
            );
        } else {
            return <h2 className={Styles.heading}>Sign In</h2>
        }
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

    ErrorMessage() {
        if (this.props.error_code || this.props.authError) {
            return (
                <div className={Styles.errorMessage}>
                    <h3 className={Styles.errorMessageHeading}>There was a problem logging you in</h3>
                    <p>
                        One common reason for this is that you attempted to login with a different social platform
                        than the one you signed up with. Please try again using the original platform you used to sign up.
                    </p>
                    <p>
                        For further support please contact support@the-social-edge.com<br />
                        <strong>{this.props.hash ? `Support Code: ${this.props.hash}` : ''}</strong>
                    </p>
                    <p>
                        Thank you!
                    </p>
                </div>
            );
        } else {
            return null;
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
