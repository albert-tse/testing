import React, { Component } from 'react';
import { Checkbox, Dropdown, Input, ListDivider } from 'react-toolbox';
import MultiSelectListDropdown from './MultiSelectListDropdown';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import QuerySource from '../../../sources/Query.source';

var runQuery = QuerySource.runQuery().remote;

export default class UsedSitesFilter extends Component {

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.state = {
        	used_sites: []
        }
    }

    componentDidMount(){
    	var component = this;

	    var query = {
		  "table": "links",
		  "fields": [
		    {
		      "name": "sites.id"
		    },
		    {
		      "name": "sites.name"
		    }
		  ],
		  "group": [
		    "sites.id",
		    "sites.name"
		  ],
		  "offset": "0"
		};

		if(this.siteQuery){
			this.siteQuery.cancel();
		}

	    this.siteQuery = runQuery({}, query).then(function(result){
	    	var sites = _.chain(result.data.data)
	    		.filter(function(el){
	    			return el.name;
	    		})
	    		.map(function(el){
					el.enabled = true;
					el.sort = el.name.toLowerCase();
					return el;
	    		})
	    		.orderBy(['sort'])
	    		.value();

	    	component.setState({
	    		used_sites: sites
	    	});

	    	if(component.state.updateListener){
	    		component.state.updateListener(component.state);
	    	}

	    	component.update(component.state.sites);
	    });
    }

    render() {
    	var component = this;
        return (
            <MultiSelectListDropdown
                filterName="used_sites"
                label="Filter sites"
                store={{
                	listen: function(setStateFunc){
                		component.updateListener = setStateFunc;
                		return function(){
                			component.updateListener = null;
                		}
                	},
                	getState: function(){
                		return {
                			used_sites: component.state.used_sites
                		}
		        	}
		        }}
                onUpdate={this.update}
            />
        );
    }

    update(newState) {
    	if(newState){
	    	this.setState(newState);
	        FilterActions.update(newState);
	    	if(this.state.updateListener){
	    		this.state.updateListener(this.state);
	    	}
    	}
    }
}