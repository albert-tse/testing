import config from '../../config';
import _ from 'lodash';

import FilterStore from '../../stores/Filter.store'
import FilterActions from '../../actions/Filter.action'


// Explore Loader Imports
import SearchStore from '../../stores/Search.store';
import SearchActions from '../../actions/Search.action';

import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';

var loaders = {};

loaders[config.routes.explore] =  {
	name: 'explore',
	path: config.routes.explore,
	toolbar: 'Filter',
	
	willMount: function(){
		FilterActions.update({ trending: false, relevant: false });
		SearchActions.getResults();
	},

	stores: {
	    search: SearchStore, 
	    filters: FilterStore
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		var search = nextProps.search;
		var filters = nextProps.filters;
        if (this.props.search.results !== search.results) {
            return true;
        } else {
            let prevFilters = _.without(Object.keys(this.props.filters), 'influencers', 'permalink');
            prevFilters = _.pick(this.props.filters, prevFilters);

            let nextFilters = _.without(Object.keys(filters), 'influencers', 'permalink');
            nextFilters = _.pick(filters, nextFilters);

            if(!_.isEqual(prevFilters, nextFilters) && this.props.filters.ucids.length === filters.ucids.length) {
                _.defer(SearchActions.getResults);
            }
            return false;
        }
	},

	loadMore: function(){
		SearchActions.loadMore();
	},

	getLoadState: function(){
		return {
			isLoadingMore: this.props.search.isLoadingMore,
			hasMore: this.props.search.total_found !== this.props.search.start
		};
	},

	articles: function(){
		return this.props.search.results;
	}
};

loaders[config.routes.relevant] = _.extend({}, loaders[config.routes.explore], {
	name: 'relevant',
	path: config.routes.relevant,
	willMount: function(){
		FilterActions.update({ trending: false, relevant: true });
		SearchActions.getResults();
	},
});

loaders[config.routes.trending] = _.extend({}, loaders[config.routes.explore], {
	name: 'trending',
	path: config.routes.trending,
	willMount: function(){
		FilterActions.update({ trending: true, relevant: false });
		SearchActions.getResults();
	},
});

loaders[config.routes.recommended] = _.extend({}, loaders[config.routes.explore], {
	name: 'recommended',
	path: config.routes.recommended,
	willMount: function(){
		FilterActions.update({ trending: true, relevant: true });
		SearchActions.getResults();
	},
});

loaders[config.routes.saved] =  {
	name: 'saved',
	path: config.routes.saved,
	toolbar: 'ListFilter',
	
	willMount: function(){
		this.setState({
			page: 0,
			pageSize: 25
		});
		ListActions.loadSpecialList('saved');
	},

	stores: {
	    list: props => ({
            store: ListStore,
            value: ListStore.getSpecialList('saved')
        }), 
	    filters: FilterStore
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		return true;
	},

	loadMore: function(){
		this.setState({
			page: this.state.page + 1
		});
	},

	getLoadState: function(){
		var list = ListStore.getSpecialList('saved').articles
		return {
			isLoadingMore: false,
			hasMore: list.articles && (this.state.page + 1) * this.state.pageSize < list.articles.length
		};
	},

	articles: function(){
		var list = ListStore.getSpecialList('saved')
		if(list.articles){
			return _.slice(list.articles,0,((this.state.page+1) * this.state.pageSize));
		} else {
			return [];
		}
	}
};

export default loaders;