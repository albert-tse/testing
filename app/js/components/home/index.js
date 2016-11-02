import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import ListPreview from './ListPreview';

import Config from '../../config';

import _ from 'lodash';

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {Config.listsOnHome.map(this.renderListPreview)}
            </div>
        );
    }

    renderListPreview(list, index) {
        return React.createElement(ListPreview, {
            key: index,
            overrides: list.overrides,
            listId: list.type === 'static' && list.id,
            specialList: list.type === 'special' && list.name,
            listObj: list.type === 'object' && list.object
        });
    }
}
