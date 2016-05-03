import React from 'react'
import { Header } from '../shared/index'
import InfluencerNameInput from './influencerName.component'
import InfluencerUrlInput from './influencerUrl.component'
import TopicsSelector from './topics.component'
import LegalFields from './legal.component'

class SignUpComponent extends React.Component {

    influencerName = {
        label: "The name of your influencer"
    }

    influencerUrl = {
        label: "Your influencer's social url"
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <div id='signup'>
                <Header />
                <div className="container">
                    <div className="jumbotron">
                        <h2>Hello there, and welcome to Contempo!</h2> 
                        <h3>Before we get started we will need a little information.</h3> 
                        <div className="form">
                            <InfluencerNameInput />
                            <InfluencerUrlInput />
                            <TopicsSelector />
                            <LegalFields />
                        </div>
                        <button type="submit" class="btn btn-default">Agree and Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUpComponent;
