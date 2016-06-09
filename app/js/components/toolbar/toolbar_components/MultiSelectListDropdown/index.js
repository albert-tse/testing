import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import AltContainer from 'alt-container';
import { Input } from 'react-toolbox';
import { IconMenu } from 'react-toolbox/lib/menu';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import FilterStore from '../../../../stores/Filter.store';
import FilterActions from '../../../../actions/Filter.action';
import Style from './style'

class MultiSelect extends Component {

    constructor(props) {
        super(props);
    }

    onSelectPlatform(index) {
        var filters = {
            platforms: _.map(FilterStore.getState().platforms, function (el, i) {
                if (index == i) {
                    el.enabled = !el.enabled;
                }
                return el;
            })
        }
        this.props.FilterActions.update(filters);
    }

    onSelectSite(index) {
        var filters = {
            sites: _.map(FilterStore.getState().sites, function (el, i) {
                if (index == i) {
                    el.enabled = !el.enabled;
                }
                return el;
            })
        }
        this.props.FilterActions.update(filters);
    }

    selectAllSites() {
        var filters = {
            sites: _.map(FilterStore.getState().sites, function (el, i) {
                el.enabled = true;
                return el;
            })
        }
        this.props.FilterActions.update(filters);
    }

    selectNoSites() {
        var filters = {
            sites: _.map(FilterStore.getState().sites, function (el, i) {
                el.enabled = false;
                return el;
            })
        }
        this.props.FilterActions.update(filters);
    }

    render() {
        return (
            <IconMenu icon={this.props.icon} position='top-right' menuRipple>
				<div className={ Style.scrollBox }>
				    <List selectable ripple>
				        <ListSubHeader caption='Platforms' className={ Style.listDivider } />
				        { _.map(FilterStore.getState().platforms, function(el, index){
				        	return (
								<ListCheckbox
						          caption={ el.name }
						          checked={ el.enabled }
						          key={ el.id }
						          onChange={ () => (::this.onSelectPlatform(index)) }
						          className={ Style.listItem }
						        />
				        	);
				        }.bind(this)) }
				        <ListSubHeader caption='Sites' className={ Style.listDivider } />
                        <div className={ Style.selectAllOptions }>
                            <span onClick={::this.selectAllSites } className={ Style.selectAll }>Select All</span>
                            <span onClick={::this.selectNoSites } className={ Style.selectNone }>Select None</span>
                        </div>
				        { _.map(FilterStore.getState().sites, function(el, index){
				        	return (
								<ListCheckbox
						          caption={ el.name }
						          checked={ el.enabled }
						          key={ el.id }
						          onChange={ () => (::this.onSelectSite(index)) }
						          className={ Style.listItem }
						        />
				        	);
				        }.bind(this)) }
				      </List>
				</div>    
			</IconMenu>
        );
    }
}


export default class MultiSelectContainer extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        return (
            <AltContainer stores={[FilterStore]} actions={{ FilterActions: FilterActions }} component={MultiSelect} inject={{icon: this.props.icon}}/>
        );
    }
}
