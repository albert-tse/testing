import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import FilterActions from '../../../actions/Filter.action';

export default class SharePermalinkButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IconButton icon="share" onClick={FilterActions.sharePermalink} />
        );
    }
}
