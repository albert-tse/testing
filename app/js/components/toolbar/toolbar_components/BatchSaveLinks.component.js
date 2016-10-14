import React, { Component } from 'react';
import LinkActions from '../../../actions/Link.action';
import CollapsibleButton from './CollapsibleButton.component';

export default class BatchSaveLinks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <CollapsibleButton icon="share" label="Generate Links" onClick={LinkActions.generateMultipleLinks} />;
    }
}
