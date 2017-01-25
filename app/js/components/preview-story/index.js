import React, { Component, PropTypes } from 'react';
import Styles from './styles';

/**
 * Preview how a story will show on a Facebook post
 */
export default class PreviewStory extends Component {

    /**
     * Create a story preview
     * @return {PreviewStory}
     */
    constructor(props) {
        super(props);
    }

    /**
     * Define component
     * @return {JSX}
     */
    render() {
        return (
            <div className={Styles.preview}>
                <div className={Styles.image} style={{ backgroundImage: 'url(' + this.props.image + ')', backgroundSize: 'cover' }} />
                <div className={Styles.metadata}>
                    <h1 className={Styles.title}>{this.props.title}</h1>
                    <p className={Styles.description}>{this.props.description}</p>
                    <footer className={Styles.site}>{this.props.siteName}</footer>
                </div>
            </div>
        );
    }
}
