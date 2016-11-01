import React, { Component } from 'react';
import { Button as ReactButton, IconButton, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import ArticleStore from '../../../stores/Article.store';
import ArticleActions from '../../../actions/Article.action';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';

class Button extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        
        const TooltipButton = Tooltip(ReactButton);
        return (
            <div>
                <TooltipButton
                    icon='cached'
                    raised={true}
                    className='rescrapeButton'
                    onClick={::this.rescrapeArticle}
                    tooltip='Rescrape Article'
                    label='rescrape'
                />
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
                actions={ ArticleActions }
            >
                <Button { ...this.props } />
            </AltContainer>
        );
    }
}
