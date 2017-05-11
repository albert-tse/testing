import React, { Component } from 'react';
import AltContainer from 'alt-container';
import Selector from './Selector.component.js';

import ShareDialogStore from '../../stores/ShareDialog.store';
import ShareDialogActions from '../../actions/ShareDialog.action';

export default class MultiInfluencerSelector extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={Selector}
                stores={{
                    influencers: function(props) {
                        return {
                            store: ShareDialogStore,
                            value: ShareDialogStore.getState().influencers
                        };
                    }
                }}
                transform={function (props) {
                    return {
                        ...props,
                        isPinned: true,
                        selectProfile: ShareDialogActions.selectProfile,
                        deselectProfile: ShareDialogActions.deselectProfile
                    };
                }}
            />
        );
    }
}
