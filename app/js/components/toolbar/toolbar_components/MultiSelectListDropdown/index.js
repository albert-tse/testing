import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Input, IconMenu, List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox';
import FilterStore from '../../../../stores/Filter.store';
import FilterActions from '../../../../actions/Filter.action';
import Style from './style'
import Styles from '../../styles'
import isEqual from 'lodash/isEqual';

class MultiSelect extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IconMenu icon={this.props.icon} position='top-right' className={Styles.defaultColor}>
				<div className={ Style.scrollBox }>
				    <List selectable ripple>
				        <ListSubHeader caption='Platforms' className={ Style.listDivider } />
                        {this.props.platforms.map((el, index) => (
                            <ListCheckbox
                              caption={ el.name }
                              checked={ el.enabled }
                              key={ el.id }
                              onChange={ this.onSelectPlatform.bind(this, index) }
                              className={ Style.listItem }
                            />
                        ))}
				        <ListSubHeader caption='Sites' className={ Style.listDivider } />
                        <div className={ Style.selectAllOptions }>
                            <span onClick={::this.selectAllSites } className={ Style.selectAll }>Select All</span>
                            <span onClick={::this.selectNoSites } className={ Style.selectNone }>Select None</span>
                        </div>
                        { this.props.sites.map((el, index) => (
                            <ListCheckbox
                              caption={ el.name }
                              checked={ el.enabled }
                              key={ el.id }
                              onChange={ this.onSelectSite.bind(this, index) }
                              className={ Style.listItem }
                            />
                        ))}
				      </List>
				</div>    
			</IconMenu>
        );
    }

    onSelectPlatform(index) {
        var filters = {
            platforms: this.props.platforms.map((el, i) => {
                if (index == i) {
                    el.enabled = !el.enabled;
                }
                return el;
            })
        }
        this.update(filters);
    }

    onSelectSite(index) {
        var filters = {
            sites: this.props.sites.map((el, i) => {
                if (index == i) {
                    el.enabled = !el.enabled;
                }
                return el;
            })
        }
        
        this.update(filters);
    }

    selectAllSites() {
        var filters = {
            sites: this.props.sites.map((el, i) => {
                el.enabled = true;
                return el;
            })
        }
        this.update(filters);
    }

    selectNoSites() {
        var filters = {
            sites: this.props.sites.map((el, i) => {
                el.enabled = false;
                return el;
            })
        }
        this.update(filters);
    }

    update(filters) {
        this.props.update(filters); // TODO add the options here
        this.props.onSelect && this.props.onSelect();
    }

}

export default class MultiSelectContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={MultiSelect}
                actions={FilterActions}
                store={FilterStore}
                inject={{
                    icon: this.props.icon,
                    onSelect: () => this.props.onSelect
                }}
            />
        );
    }
}
