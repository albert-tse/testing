import React from 'react'
import { Header } from '../shared/index'
import InfluencerNameInput from './influencerName.component'
import InfluencerUrlInput from './influencerUrl.component'
import Submit from './Submit.component';
import TopicsSelector from '../shared/forms/topics.component'
import LegalFields from './legal.component'
import EmailInput from '../shared/forms/userEmail.component'
import Analytics from '../shared/Analytics.component';
import Styles from './style'
import { jumbotron, overlay, container, scrollable, twoColumns, vertical } from '../common';
import classnames from 'classnames';

class SignUpComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var errorMessage = "";
        if (this.props.setupUserError) {
            errorMessage = "There was an error setting up your account. Please review the information above, and try again. If this problem persists, please contact support at support@the-social-edge.com.";
            if (this.props.setupUserError.error_code == "invalid_social_profile") {
                errorMessage = "There was an error validating your influencer's proflie. Please verify that the specified profile is correct and visible to the public, and try again. If this problem persists, please contact support at support@the-social-edge.com.";
            }

            if(this.props.setupUserError.hash){
                errorMessage += ' Support Code: ' + this.props.setupUserError.hash;
            }
        }

        return (
            <div id="signup" className={classnames(scrollable, vertical)}>
                <Analytics />
                <div className={classnames(Styles.sendToBack, 'with-cover')}>
                    <div className={overlay}>
                    </div>
                </div>
                <div className="container">
                    <div className={jumbotron}>
                        <h1>2 easy steps and you're using Contempo!</h1>
                        <form onSubmit={this.props.onSubmit}>
                            <div className="form">
                                <h2><strong>1</strong> Let us know about you</h2>
                                <div className={twoColumns}>
                                    <InfluencerNameInput ref={(c) => this.influencerNameInput = c} />
                                    <EmailInput ref={(c) => this.userEmailInput = c} email={this.props.user && this.props.user.email ? this.props.user.email : ''} text='Your Email'/>
                                </div>
                                <InfluencerUrlInput ref={(c) => this.influencerUrlInput = c} setupUserError={this.props.setupUserError} />
                                <TopicsSelector ref={(c) => this.topicsSelector = c} text='Help us make better content recommendations for you by selecting a few topics:'/>
                                <h2><strong>2</strong> How we work together</h2>
                                <LegalFields ref={(c) => this.legalFields = c} />
                            </div>
                            <div className={ Styles.errorMessage }>{ errorMessage }</div>
                            <Submit />
                        </form>
                    </div>
                    <a onClick={this.props.onLogout} className={Styles.logout}>
                        Wrong account, or need to logout? Click here.
                    </a>
                </div>
                { this.renderModalBackdrop() }
            </div>
        );
    }

    getFields() {
        return {
            influencerName: this.influencerNameInput,
            influencerUrl: this.influencerUrlInput,
            topics: this.topicsSelector,
            legal: this.legalFields,
            email: this.userEmailInput
        };
    }

    renderModalBackdrop() {
        var classNames = 'modal-backdrop ';

        if (this.props.isLoading) {
            classNames += ' fade in';
        } else {
            classNames += ' hidden';
        }

        return (
            <div className={ classNames }></div>
        );
    }

}

export default SignUpComponent;
