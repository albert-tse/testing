import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { omit } from 'lodash';

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
        this.onChange = this.props.onChange;
        this.componentDidMount = this.cacheCallbackMethods.bind(this);
        this.componentDidUpdate = this.cacheCallbackMethods.bind(this);
        this.state = {
            ...props,
            message: props.value || ''
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
                    maxLength={/twitter/i.test(this.props.platform) && maxLengthForTwitter} />
            </div>
        );
    }

    /**
     * Cache callback methods
     */
    cacheCallbackMethods() {
        this.onChange = this.props.onChange;
    }

    /**
     * Update the parent element with the new state
     * @param {Event} evt contains the element and its value
     */
    updateParent(evt) {
        const message = evt.currentTarget.value;
        const newState = {
            ...this.state,
            message: message
        };

        this.setState(newState, () => {
            this.onChange && this.onChange(omit(this.state, 'onChange'));
        });
    }
}

const maxLengthForTwitter = 115; // We need to make room for the link
