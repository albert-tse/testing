import React, { Component, PropTypes } from 'react';
import Container from 'alt-container';
import { AppBar, IconButton } from 'react-toolbox';
import classnames from 'classnames';

import Config from '../../../config';
import History from '../../../history';

import FilterStore from '../../../stores/Filter.store';
import ListStore from '../../../stores/List.store';

import InfluencerSwitcher from './InfluencerSwitcher.component';
import FilterButton from './FilterButton.component';
import SecondaryMenu, { options } from './SecondaryMenu.component';
import { ClearSelectionButton } from '../../toolbar/toolbar_components';
import { ToolbarSpecs } from '../../toolbar';
import {appBar, label, rightItems, selection, title, upButton, withIcon} from './styles';

const Explorer = props => {
    return !Array.isArray(props.selected) 
        ? <Filter {...props} />
        : <Selection {...props} />
};

const Filter = props => (
    <AppBar flat className={classnames(appBar, withIcon)}>
        <UpButton {...props.location} />
        <div className={rightItems}>
            <InfluencerSwitcher />
            <FilterButton toolbar={props.toolbar} />
            <SecondaryMenu />
        </div>
    </AppBar>
);

const Selection = props => {
    const selectionToolbar = ToolbarSpecs[props.selection] || {};
    return (
        <AppBar flat className={classnames(appBar, selection, withIcon)}>
            <ClearSelectionButton />
            <div className={rightItems}>
                {props.selected.length > 0 && selectionToolbar.right}
            </div>
        </AppBar>
    );
};

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
        <IconButton icon='arrow_back' onClick={History.push.bind(null, Config.routes.explore)} />
        <h1 className={label}>{props.label}</h1>
    </div>
);

Explorer.proptypes = {
    /** determines which page is currently loaded so we know which nav item to set as active */
    location: PropTypes.object.isRequired 
};

export default Explorer;
