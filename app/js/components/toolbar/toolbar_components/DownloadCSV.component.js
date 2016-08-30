import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button } from 'react-toolbox';
import FilterStore from '../../../stores/Filter.store';
import UserStore from '../../../stores/User.store';
import InfluencerSource from '../../../sources/Influencer.source';

export default class DownloadCSV extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                store={FilterStore}
                component={Button}
                transform={ props => ({
                    icon: 'file_download',
                    label: 'Download CSV',
                    onClick: this.onClick.bind(this, props)
                })}
            />
        );
    }

    onClick(props) {
        if (window) {
            const selectedInfluencerId = UserStore.getState().selectedInfluencer.id;
            const monthOffset = props.selectedAccountingMonth;
            window.open(InfluencerSource.getMonthlyPayout().downloadLink(selectedInfluencerId, monthOffset));
        }
    }
}
