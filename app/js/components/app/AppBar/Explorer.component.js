import React, { Component, PropTypes } from 'react';
import Container from 'alt-container';
import { AppBar, IconButton } from 'react-toolbox';

import Config from '../../../config';
import History from '../../../history';

import FilterStore from '../../../stores/Filter.store';
import ListStore from '../../../stores/List.store';

import InfluencerSwitcher from './InfluencerSwitcher.component';
import FilterButton from './FilterButton.component';
import SecondaryMenu, { options } from './SecondaryMenu.component';
import {appBar, label, rightItems, title, upButton} from './styles';

const Explorer = props => (
    <AppBar flat className={appBar}>
        <UpButton {...props.location} />
        <div className={rightItems}>
            <InfluencerSwitcher />
            <FilterButton toolbar={props.toolbar} />
            <SecondaryMenu />
        </div>
    </AppBar>
);

const UpButton = location => (
    <Container 
        store={ListStore} 
        component={UpButtonComponent} 
        inject={{ 
            label: props => (
                /list/.test(location.pathname)
                ? ListStore.getName(parseInt(location.pathname.match(/\d+$/)))
                : /search/.test(location.pathname)
                    ? FilterStore.getState().text
                    : Config.lists.names[location.pathname.replace('/','')]
            )
        }}
    />
);

const UpButtonComponent = props => (
    <div className={title}>
        <IconButton className={upButton} icon='arrow_back' onClick={History.push.bind(null, Config.routes.explore)} />
        <h1 className={label}>{props.label}</h1>
    </div>
);

Explorer.proptypes = {
    /** determines which page is currently loaded so we know which nav item to set as active */
    location: PropTypes.object.isRequired 
};

export default Explorer;
