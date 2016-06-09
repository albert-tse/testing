import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { IconButton } from 'react-toolbox';
import LinkActions from '../../../actions/Link.action';

export default class BatchSaveLinks extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        return (
            <IconButton icon="link" onClick={LinkActions.generateMultipleLinks} />
        );
    }
}
