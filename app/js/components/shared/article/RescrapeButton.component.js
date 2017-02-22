import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';
import { Button, IconButton, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import { pick } from 'lodash';

import Styles from './styles.action-buttons';

import ArticleStore from '../../../stores/Article.store';
import ArticleActions from '../../../actions/Article.action';

class Contained extends Component {
    constructor(props) {
        super(props);
        this.rescrapeArticle = this.rescrapeArticle.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        const props = {
            icon: 'cached',
            onClick: this.rescrapeArticle,
            label: 'rescrape'
        };

        return (
            <div>
                <Button className={Styles.normal} {...props} />
                <IconButton className={Styles.icon} {...props} />
            </div>
        );
    }

    rescrapeArticle(evt) {
        var { ucid, rescrape } = this.props;
        rescrape(ucid);
        return evt.stopPropagation();
    }
}

export default class RescrapeButton extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={Contained}
                actions={ ArticleActions }
                inject={pick(this.props, 'ucid')}
            />
        );
    }
}
