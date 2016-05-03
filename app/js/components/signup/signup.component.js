import React from 'react'
import { Header } from '../shared/index'
import InfluencerNameInput from './influencerName.component'
import InfluencerUrlInput from './influencerUrl.component'
import TopicsSelector from './topics.component'
import LegalFields from './legal.component'

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
            legal: this.legalFields
        };
    }

    render() {
        return (
            <div id='signup'>
                <Header />
                <div className="container">
                    <div className="jumbotron">
                        <h2>Hello there, and welcome to Contempo!</h2> 
                        <h3>Before we get started we will need a little information.</h3> 
                        <form onSubmit={this.props.onSubmit}>
                            <div className="form">
                                <InfluencerNameInput ref={(c) => this.influencerNameInput = c} />
                                <InfluencerUrlInput ref={(c) => this.influencerUrlInput = c} />
                                <TopicsSelector ref={(c) => this.topicsSelector = c} />
                                <LegalFields ref={(c) => this.legalFields = c} />
                            </div>
                            <button type="submit" class="btn btn-default" >Agree and Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUpComponent;
