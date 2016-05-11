import React from 'react'
import TopicsSelector from '../shared/forms/topics.component'
import EmailInput from '../shared/forms/userEmail.component'

class SettingsComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    getFields() {
        return {
            topics: this.topicsSelector,
            email: this.userEmailInput
        };
    }

    render() {
        return (
            <div id="settings">
                <div className="container">
                    <div className="jumbotron">
                        <h2>User Settings</h2>
                        <form onSubmit={this.props.onSubmit}>
                            <EmailInput ref={(c) => this.userEmailInput = c} text='Email Address' email={this.props.user && this.props.user.email ? this.props.user.email : ''} />
                            <TopicsSelector ref={(c) => this.topicsSelector = c} text='Topics of Interest' topics={this.props.user && this.props.user.topics ? this.props.user.topics : ''} />
                            <button type="submit" className="btn btn-primary" >Save</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsComponent;
