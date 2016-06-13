import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { IconButton } from 'react-toolbox';
import FilterActions from '../../../actions/Filter.action';

export default class SharePermalinkButton extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        return (
            <IconButton icon="share" onClick={FilterActions.sharePermalink} />
        );
    }
}
