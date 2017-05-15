import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button, IconButton } from 'react-toolbox';
import FilterStore from '../../../stores/Filter.store';
import LinkSource from '../../../sources/Link.source';
import { isMobilePhone } from '../../../utils';

export default class DownloadCSV extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const isMobile = isMobilePhone();

        return (
            <AltContainer
                store={FilterStore}
                component={isMobile ? IconButton : Button}
                transform={ props => ({
                    ...this.props,
                    icon: 'file_download',
                    label: !isMobile && 'Download CSV',
                    onClick: this.onClick.bind(this, props)
                })}
            />
        );
    }

    onClick(props) {
        if (window) {
            window.open(LinkSource.fetchLinks().downloadLink());
        }
    }
}
