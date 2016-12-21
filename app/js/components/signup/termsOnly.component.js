import React from 'react'
import classnames from 'classnames';

import { Header } from '../shared/index'
import LegalFields from './legal.component'
import EmailInput from '../shared/forms/userEmail.component'
import Styles from './style'

class TermsOnlyComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    getFields() {
        return {
            legal: this.legalFields
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

    render() {
        var errorMessage = "";
        if (this.props.setupUserErrorCode) {
            errorMessage = "There was an error setting up your account. Please review the information above, and try again. If this problem persists, please contact support at support@the-social-edge.com.";
        }

        return (
            <div id="signup" className={classnames('send-to-back', Styles.scrollable)}>
                <Header className="extended with-cover" />
                <div className="container">
                    <div className="jumbotron">
                        <div className="page-header">
                            <h1>
                                Terms of Service<br />
                                <small>We have updated our Terms of Service, please accept the below terms to continue.</small> 
                            </h1> 
                        </div>
                        <form onSubmit={this.props.onSubmit}>
                            <div className="form">
                                <LegalFields ref={(c) => this.legalFields = c} hideComms={true}/>
                            </div>
                            <div className={ Styles.errorMessage }>{ errorMessage }</div>
                            <button id="submitButton" type="submit" className="btn btn-primary" >Agree and Submit</button>
                        </form>
                    </div>
                </div>
                { this.renderModalBackdrop() }
            </div>
        );
    }
}

export default TermsOnlyComponent;
