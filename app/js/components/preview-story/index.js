import React, { Component, PropTypes } from 'react';
import { Input } from 'react-toolbox';
import { omit, partial } from 'lodash';
import classnames from 'classnames';

import InlineEditor from '../inline-editor';

import Styles from './styles';

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
        this.updateParent = this.props.onChange;
        this.state = {
            ...omit(this.props, 'onChange')
        };
    }

    componentDidMount() {
        this.updateParent && this.updateParent(this.state);
    }

    /**
     * Define component
     * @return {JSX}
     */
    render() {
        const article = this.state;

        return (
            <div className={Styles.preview}>
                <div className={Styles.image} style={{ backgroundImage: 'url(' + this.props.image + ')', backgroundSize: 'cover' }} />
                <div className={Styles.metadata}>
                    <InlineEditor initialValue={article.title} onChange={this.updatePreviewMetadata.bind(this, 'title')}>
                        <h1 className={Styles.title}>{article.title}</h1>
                    </InlineEditor>
                    <InlineEditor initialValue={article.description} onChange={this.updatePreviewMetadata.bind(this, 'description')}>
                        <p className={Styles.description}>{article.description}</p>
                    </InlineEditor>
                    <footer className={Styles.site}>{article.siteName}</footer>
                </div>
            </div>
        );
    }

    /**
     * Update preview metadata
     * @param {String} fieldName of preview metadata
     * @param {String} value that we need to replace current one with
     */
    updatePreviewMetadata(fieldName, value) {
        this.setState({ [fieldName]: value }, () => this.updateParent && this.updateParent(this.state));
    }

}
