import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Button } from 'react-toolbox';
import LinkActions from '../../../actions/Link.action';

export default class BatchSaveLinks extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        return (
        	<div title="Generate Links">
            	<Button icon="link" label="Generate Links" onClick={LinkActions.generateMultipleLinks} />
            </div>
        );
    }
}
