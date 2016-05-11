import React from 'react'
import { Header } from '../shared/index'
import InfluencerNameInput from './influencerName.component'
import InfluencerUrlInput from './influencerUrl.component'
import TopicsSelector from '../shared/forms/topics.component'
import LegalFields from './legal.component'
import EmailInput from '../shared/forms/userEmail.component'

class SignUpComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

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

    render() {
        return (
            <div id="signup">
                <Header className="extended with-cover" />
                <div className="container">
                    <div className="jumbotron">
                        <div className="page-header">
                            <h1>
                                Hello there, and welcome to Contempo!<br />
                                <small>Before we get started we will need a little information.</small> 
                            </h1> 
                        </div>
                        <form onSubmit={this.props.onSubmit}>
                            <div className="form">
                                <InfluencerNameInput ref={(c) => this.influencerNameInput = c} />
                                <EmailInput ref={(c) => this.userEmailInput = c} email={this.props.user && this.props.user.email ? this.props.user.email : ''} text='Your Email'/>
                                <InfluencerUrlInput ref={(c) => this.influencerUrlInput = c} />
                                <TopicsSelector ref={(c) => this.topicsSelector = c} text='Select a few topics you are interested in'/>
                                <LegalFields ref={(c) => this.legalFields = c} />
                            </div>
                            <button type="submit" className="btn btn-primary" >Agree and Submit</button>
                        </form>
                    </div>
                </div>
                { this.renderModalBackdrop() }
            </div>
        );
    }
}

export default SignUpComponent;
