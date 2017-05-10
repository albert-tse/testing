import React, { Component, PropTypes } from 'react';
import { Input } from 'react-toolbox';
import classnames from 'classnames';

import inputTheme from './styles.editor';
import Styles from './styles';

/**
 * This is a wrapper component that allows the wrapped component to be edited inline
 * Mimics Facebook's preview story card in its share dialog
 */
export default class InlineEditor extends Component {

    /**
     * Create an inline-editable text
     * @param {Object} props are defined at the bottom
     * @return {InlineEditor}
     */
    constructor(props) {
        super(props);
        this.editor = null;
        this.toggleEditing = this.toggleEditing.bind(this);
        this.checkIfComplete = this.checkIfComplete.bind(this);
        this.complete = this.complete.bind(this);
        this.update = this.update.bind(this);
        this.updateParent = this.props.onChange;
        this.state = {
            editing: false,
            value: this.props.initialValue
        }
    }

    /**
     * Define the component
     * @return {JSX}
     */
    render() {
        const childProps = {
            ...this.props.children.props,
            className: classnames(this.props.children.props.className, Styles.editable)
        };

        return (
            <div className={classnames(this.state.editing && Styles.editing, Styles.editGroup)}>
                {<this.props.children.type {...childProps} onClick={this.toggleEditing} />}
                <Input
                    className={classnames(Styles.editor)}
                    label={false}
                    multiline
                    onChange={this.update}
                    onBlur={this.complete}
                    onKeyPress={this.checkIfComplete}
                    ref={c => this.editor = c}
                    theme={inputTheme}
                    value={this.state.value}
                />
            </div>
        );
    }

    /**
     * When the user clicks on the display component, switch to the inline editor component
     * @param {Event} evt not used
     */
    toggleEditing(evt) {
        this.setState({ editing: !this.state.editing }, () => {
            this.editor.getWrappedInstance().focus();
        });
    }

    /**
     * Update the value inside the inline editor
     * @param {String} value of the inline editor to update the state with
     */
    update(value) {
        this.setState({ value });
    }

    /**
     * Allows user to finish editing when he/she presses the Enter/Return key
     * @param {Event} evt contains key
     */
    checkIfComplete(evt) {
        evt.key === 'Enter' && this.complete();
    }

    /**
     * Finish editing and update the parent element so that it can update the display component's text
     */
    complete() {
        this.setState(state => {
            return {
                editing: false,
                ...(state.value.length < 1 ? { value: this.props.initialValue } : {})
            };
        }, () => {
            this.updateParent && this.updateParent(this.state.value)
        });
    }
}
