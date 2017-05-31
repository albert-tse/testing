import React, { Component } from 'react';
import { Button, ProgressBar } from 'react-toolbox';
import classnames from 'classnames';
import { defer } from 'lodash';

import Config from '../../../config';
import History from '../../../history';
import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';

import Styles from './styles.share-dialog';

/**
 * Legacy share dialog that lets user
 * share on Facebook, Twitter, or copy the shortlink
 * @return {JSX}
 */
export default class LegacyShareDialog extends Component {

    /**
     * Create a dialog component
     * only use this when user has not connected any platforms yet
     * @return {LegacyShareDialog}
     */
    constructor(props) {
        super(props);
        this.state = {
            copyLinkLabel
        }
    }

    componentDidMount() {
        const { generateLink, ucid } = this.props;
        defer(generateLink, { ucid });
    }

    /**
     * Define component
     * @return {JSX}
     */
    render() {
        const className = classnames(
            Styles.legacy,
            !this.props.showCTAToAddProfiles && Styles.hideCTA,
            !this.props.shortlink && Styles.showLoadingIndicator
        );
        return (
            <div className={className}>
                {this.props.showCTAToAddProfiles && (
                    <div className={Styles.addScheduling}>
                        <h2>Want to schedule your post?</h2>
                        <p className={Styles.message}>Manage and schedule your posts to Facebook and Twitter directly from Contempo! Connect as many pages or profiles as you like.</p>
                        <Button accent raised label="Enable Scheduling" onClick={this.connectAccounts} />
                    </div>
                )}
                {this.props.shortlink ? (
                    <footer className={Styles.copyLink}>
                        <input ref={shortlink => this.shortlink = shortlink} className={Styles.shortLink} value={this.props.shortlink} readOnly />
                        <div>
                            {this.generateActions(this.props.shortlink).map(props => <Button key={props.label} {...props} />)}
                        </div>
                    </footer>
                ) : (
                    <ProgressBar type="circular" mode="indeterminate" />
                )}
            </div>
        );
    }

    connectAccounts(evt) {
        window.open('/#' + Config.routes.manageAccounts);
        evt.stopPropagation();
    }

    /**
     * This is used in legacy share dialog
     * Lists out options for sharing: Facebook, Twitter, or copy shortlink
     * @param {String} shortlink that was generated
     * @return {Array}
     */
    generateActions(shortlink) {
        return [
            {
                icon: 'link',
                label: this.state.copyLinkLabel,
                onClick: this.copyLink.bind(this, shortlink)
            }
        ];
    }

    /**
     * Opens a new tab leading user to the platform they chose to share on
     * @param {String} platform they chose to share on
     * @param {String} shortlink leading to the full story
     */
    openPlatformDialogTab(platform, shortlink) {
        let element = document.createElement('a');
        element.target = '_blank';
        element.href = intentUrls[platform] + shortlink;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        this.closeDialog();
    }

    /**
     * Called when user clicks on "Copy Link"
     * copies the currently generated shortlink to the User's clipboard
     * @param {String} shortlink that was recently generated
     */
    copyLink(shortlink) {
        let textField = document.createElement('input');
        this.shortlink.focus();
        this.shortlink.setSelectionRange(0,999);
        document.execCommand('copy');
        this.shortlink.blur();
        this.setState({ copyLinkLabel: 'Copied!' });
        this.closeDialog();
    }

    /**
     * Closes the share dialog
     */
    closeDialog() {
        setTimeout(() => {
            ShareDialogActions.close();
            this.setState({ copyLinkLabel });
        }, 1000);
    }

}

const copyLinkLabel = 'Copy Link';
