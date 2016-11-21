import React, { Component } from 'react';
import LinkActions from '../../../actions/Link.action';
import CollapsibleButton from './CollapsibleButton.component';
import { flip } from '../../common';

export default class BatchSaveLinks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <CollapsibleButton className={flip} icon="reply" label="Generate Links" onClick={LinkActions.generateMultipleLinks} />;
    }
}
