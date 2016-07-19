import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dialog, Button } from 'react-toolbox';
import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';
import Styles from './styles';

export default class ShareDialog extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <AltContainer component={CustomDialog} store={ShareDialogStore} />;
    }
}

class CustomDialog extends Component {

    constructor(props) {
        super(props);
        this.state = { copyLinkLabel };
    }

    render() {
        return (
            <Dialog
                active={this.props.isActive}
                actions={this.generateActions(this.props.shortlink)}
                title="Share this Article"
                className={Styles.shareDialog}
                onOverlayClick={evt => ShareDialogActions.close()}
            >
                <h3>{'article' in this.props.link ? this.props.link.article.title : ''}</h3>
                <strong>{this.props.shortlink}</strong>
            </Dialog>
        );
    }

    generateActions(shortlink) {
        return [
            {
                icon: "link",
                label: this.state.copyLinkLabel,
                onClick: this.copyLink.bind(this, shortlink)
            }, {
                icon: <i className="fa fa-facebook" />,
                label: 'Facebook',
                style: { backgroundColor: 'rgb(59,89,152)', color: 'white' },
                onClick: this.openPlatformDialogTab.bind(this, 'facebook', shortlink)
            }, {
                icon: <i className="fa fa-twitter" />,
                label: 'Twitter',
                style: { backgroundColor: 'rgb(85,172,238)', color: 'white' },
                onClick: this.openPlatformDialogTab.bind(this, 'twitter', shortlink)
            }
        ];
    }

    copyLink(shortlink) {
        let textField = document.createElement('input');
        document.body.appendChild(textField);
        textField.value = shortlink;
        textField.select();
        document.execCommand('copy');
        document.body.removeChild(textField);
        this.setState({ copyLinkLabel: 'Copied!' });
        this.closeDialog();
    }

    openPlatformDialogTab(platform, shortlink) {
        let element = document.createElement('a');
        element.target = '_blank';
        element.href = intentUrls[platform] + shortlink;
        document.body.appendChild(element);
        element.dispatchEvent(new Event('click'));
        document.body.removeChild(element);
        this.closeDialog();
    }

    closeDialog() {
        setTimeout(() => {
            ShareDialogActions.close();
            this.setState({ copyLinkLabel });
        }, 1000);
    }
}

CustomDialog.propTypes = {
    isActive: React.PropTypes.bool.isRequired,
    shortlink: React.PropTypes.string.isRequired,
    link: React.PropTypes.object.isRequired
};

const copyLinkLabel = 'Copy Link';
const intentUrls = {
    twitter: 'https://twitter.com/intent/tweet?url=',
    facebook: 'https://www.facebook.com/sharer/sharer.php?u='
};
