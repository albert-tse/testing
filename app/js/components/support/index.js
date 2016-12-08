import React, { Component, PropTypes } from 'react';
import Config from '../../config';
import { injectScript, injectStylesheet } from '../../utils';
import Styles from './styles.scss';

import classnames from 'classnames';

export default class Support extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        try {
            injectScript(Config.freshdesk.widgetSrc);
            injectStylesheet(Config.freshdesk.styleSrc);
        } catch (e) {
            console.warn('DOM not found', e);
        }
    }

    render() {
        return (
            <div className={Styles.container}>
                <iframe
                    className={classnames('freshwidget-embedded-form', Styles.frame)}
                    title="Feedback Form"
                    id="freshwidget-embedded-form"
                    src={Config.freshdesk.iframeSrc}
                    scrolling="no"
                    frameborder="0"
                />
            </div>
        );
    }
}
