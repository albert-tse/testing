import React, { Component } from 'react';
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

    componentDidMount() {}

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
    }

    componentDidMount() {}

    render() {
        return (
            <AltContainer stores={[FilterStore]} actions={{ FilterActions: FilterActions }} component={MultiSelect} inject={{icon: this.props.icon}}/>
        );
    }
}
