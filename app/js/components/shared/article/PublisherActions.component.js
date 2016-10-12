import React, { Component } from 'react';
import { Button } from 'react-toolbox';

import ArticleStore from '../../../stores/Article.store';
import ArticleActions from '../../../actions/Article.action';

export default class PublisherActions extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const isEnabled = this.props.article.enabled > 0;
        const ucid = this.props.article.ucid;

        return (
            <div>
                <Button primary label="Edit" onClick={evt => { 
                    evt.stopPropagation(); 
                    ArticleActions.edit(this.props.article);
                }} />
                <Button primary label={isEnabled ? "Disable" : "Enable"} onClick={evt => { 
                    evt.stopPropagation();
                    ArticleActions.toggle({ ucid: ucid, markEnabled: !isEnabled });
                }} />
            </div>
        );
    }
    
}
