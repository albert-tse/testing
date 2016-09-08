import React from 'react';
import TopicsSelector from '../shared/forms/topics.component';
import EmailInput from '../shared/forms/userEmail.component';
import { AppContent } from '../shared';
import { Button } from 'react-toolbox';
import { Toolbars } from '../toolbar';
import UserStore from '../../stores/User.store';
import Styles from './styles';
import Typography from '../../../scss/typography';

class SettingsComponent extends React.Component {

    constructor(props) {
        super(props);
        this.userName = this.getName();
    }

    componentDidUpdate() {
        this.userName = this.getName();
    }

    render() {
        return (
            <div>
                <Toolbars.Settings />
                <AppContent id="Settings">
                    {this.renderContent()}
                </AppContent>
            </div>
        );
    }

    renderContent() {
        return (
            <div id="settings" className={Styles.container}>
                <h1 className={Typography.contentHeadline}>Hi {this.userName}</h1>
                <form onSubmit={this.props.onSubmit}>
                    <EmailInput ref={(c) => this.userEmailInput = c} text='Email Address' email={this.props.user && this.props.user.email ? this.props.user.email : ''} />
                    <TopicsSelector ref={(c) => this.topicsSelector = c} text='Topics of Interest' topics={this.props.user && this.props.user.topics ? this.props.user.topics : ''} />
                    <Button className={Styles.saveButton} type="submit" label="Save" />
                </form>
            </div>
        );
    }

    getFields() {
        return {
            topics: this.topicsSelector,
            email: this.userEmailInput
        };
    }

    getName() {
        return UserStore.getState().user.name;
    }

}

export default SettingsComponent;
