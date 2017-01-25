import React, { Component, PropTypes } from 'react';
import { Input } from 'react-toolbox';

import Styles from './styles';
import { omit, partial } from 'lodash';
import classnames from 'classnames';

/**
 * Preview how a story will show on a Facebook post
 * TODO: add edit article
 */
export default class PreviewStory extends Component {

    /**
     * Create a story preview
     * @return {PreviewStory}
     */
    constructor(props) {
        super(props);
        this.onChange = this.props.onChange;
        this.edit = this.edit.bind(this);
        this.state = {
            newTitle: '',
            newDescription: '',
            output: omit(this.props, 'onChange')
        };
    }

    componentDidMount() {
        this.onChange && this.onChange(this.state.output);
    }

    /**
     * Define component
     * @return {JSX}
     */
    render() {
        const article = this.state.output;

        return (
            <div className={Styles.preview}>
                <div className={Styles.image} style={{ backgroundImage: 'url(' + this.props.image + ')', backgroundSize: 'cover' }} />
                <div className={Styles.metadata}>



                    <div className={classnames(Styles.editGroup, this.state.newTitle.length > 0 && Styles.editing)}>
                        <h1 className={classnames(Styles.editable, Styles.title)} onClick={partial(this.edit, _, 'newTitle', 'title')}>{article.title}</h1>
                        <Input className={classnames(Styles.editor)} multiline value={this.state.newTitle} onChange={this.updateValue.bind(this, 'newTitle')} onKeyPress={this.checkIfSubmitted.bind(this, 'newTitle', 'title')} />
                    </div>





                    {/*<p className={classnames(Styles.editable, Styles.description)}>{this.state.description}</p>
                    <div className={this.state.editingDescription && Styles.editing}>
                        <p className={classnames(Styles.editable, Styles.description)}>{this.state.description}</p>
                        <textarea className={classnames(Styles.editor, Styles.editDescription)} />
                    </div>
                    <footer className={Styles.site}>{this.state.siteName}</footer>*/}
                </div>
            </div>
        );
    }

    /**
     * Mark one of the fields as being edited
     * @param {Event} evt contains click event
     * @param {String} fieldName is the name of the property in the state wherein current value of editable will be stored temporarily
     * @param {String} outputFieldName is the name of the property in output state
     */
    edit(evt, fieldName, outputFieldName) {
        this.setState({ [fieldName]: this.state.output[outputFieldName] });
    }

    /**
     * Update the value of the editor
     * @param {String} fieldName is the name of the state property storing the value of the editor
     * @param {String} value recently entered text
     */
    updateValue(fieldName, value) {
        this.setState({ [fieldName]: value });
    }

    /**
     * Check if user entered the [Return] key which means they are finished editing the current field
     * @param {String} fieldName is the name of the state property storing the value of the editor
     * @param {String} outputFieldName is the name of the state property that stores the final value of the field
     * @param {Event} evt is the event containing which key was pressed
     */
    checkIfSubmitted(fieldName, outputFieldName, evt) {
        if (evt.key === 'Enter') {
            this.setState({
                [fieldName]: '',
                output: { ...this.state.output, [outputFieldName]: this.state[fieldName] }
            });
        }
    }

    /**
     * This is called once user finishes editing a field or focuses on another field
     * @param {Event} evt click event containing value entered by user
     */
}

PreviewStory.defaultProps = {
    editingTitle: false,
    editingDescription: false
};
