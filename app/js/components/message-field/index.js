import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';

import Styles from './styles';

/**
 * A wrapped input field that is used for sharing a status on a social platform
 */
export default class MessageField extends Component {

    /**
     * Create an input field
     * @param {Object} props refer to prop types at the bottom
     * @return {MessageField}
     */
    constructor(props) {
        super(props);
        this.updateParent = this.updateParent.bind(this);
        this.onChange = debounce(this.props.onChange, 1000);
        this.countCharacters = this.countCharacters.bind(this);
        this.maxLength = /twitter/i.test(this.props.platform) && maxLengthForTwitter;
        this.state = {
            ...omit(props, 'onChange'),
            message: this.props.value || '',
            characterCount: this.maxLength
        };
    }

    /**
     * Define component here
     * @return {JSX}
     */
    render() {
        return (
            <div className={Styles.messageField}>
                <label className={Styles.label}>
                    <i className={classnames('fa fa-' + this.props.platform.toLowerCase() + '-square', Styles.icon)} />
                    <span className={Styles.prompt}>message on {this.props.platform}</span>
                </label>
                <textarea
                    className={Styles.message}
                    placeholder="What's on your mind?"
                    onBlur={this.updateParent}
                    onChange={this.countCharacters}
                    maxLength={this.maxLength}
                    value={this.state.message}
                />
                {!!this.maxLength && <p className={Styles.characterCount}>{this.state.characterCount}</p>}
            </div>
        );
    }

    /**
     * Update the parent element with the new state
     * @param {Event} evt contains the element and its value
     */
    updateParent(evt) {
        const message = evt.currentTarget.value;
        const newState = {
            message: message
        };

        this.setState(newState, () => {
            this.onChange && this.onChange(this.state);
        });
    }

    /**
     * Count how many characters are in the message field
     * Used for Twitter to make sure it is under max length criteria
     * @param {Event} evt that triggered on change event
     */
    countCharacters(evt) {
        this.setState({
            message: evt.currentTarget.value,
            characterCount: this.maxLength - evt.currentTarget.value.length
        }, () => {
            this.onChange && this.onChange(this.state);
        });
    }
}

const maxLengthForTwitter = 140; // We need to make room for the link
