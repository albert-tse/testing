import React from 'react';
import TopicsSelector from '../shared/forms/topics.component';
import EmailInput from '../shared/forms/userEmail.component';
import { AppContent } from '../shared';
import { Button } from 'react-toolbox';

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
            <div>
                <AppContent id="Settings">
                    {this.renderContent()}
                </AppContent>
            </div>
        );
    }

    renderContent() {
        return (
            <div id="settings">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3 col-xl-4 col-xl-offset-4">
                            <form onSubmit={this.props.onSubmit}>
                                <EmailInput ref={(c) => this.userEmailInput = c} text='Email Address' email={this.props.user && this.props.user.email ? this.props.user.email : ''} />
                                <TopicsSelector ref={(c) => this.topicsSelector = c} text='Topics of Interest' topics={this.props.user && this.props.user.topics ? this.props.user.topics : ''} />
                                <Button type="submit" label="Save" raised accent />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsComponent;
