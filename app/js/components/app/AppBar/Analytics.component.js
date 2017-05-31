import React, { Component } from 'react';
import { AppBar } from 'react-toolbox';

import { Brand } from './index';
import FilterButton from './FilterButton.component';
import InfluencerSwitcher from './InfluencerSwitcher.component';
import SecondaryMenu, { options } from './SecondaryMenu.component';
import { appBar, rightItems} from './styles';

const withoutSelectMenuItem = options.slice(1, options.length);

const Analytics = props => (
    <AppBar flat className={appBar}>
        <Brand />
        <div className={rightItems}>
            <InfluencerSwitcher />
            <FilterButton filters={props.filters} />
            {props.actions}
            <SecondaryMenu options={withoutSelectMenuItem} />
        </div>
    </AppBar>
);

export default Analytics;
