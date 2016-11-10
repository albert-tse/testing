import config from '../../config';
import _ from 'lodash';
import moment from 'moment';

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

function ListFactory(name, route, loadList, getList){
	return {
		name: name,
		path: route,
		toolbar: 'ListFilter',
		
		willMount: function(){
			this.setState({
				page: 0,
				pageSize: 25
			});
			loadList();
		},

		stores: {
		    list: props => ({
	            store: ListStore,
	            value: getList()
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
			var list = getList().articles
			return {
				isLoadingMore: false,
				hasMore: list.articles && (this.state.page + 1) * this.state.pageSize < list.articles.length
			};
		},

		articles: function(){
			var list = getList();
			if(list.articles){
				//Filter the list
				var articles = _.filter(list.articles, function(el){
					if(this.props.filters){
						var filters = this.props.filters;

						var site = _.find(filters.sites, {id: el.article_site_id});
						if(!site.enabled){
							return false;
						}


					}
					console.log(el);
					console.log(this.props);

					return true;
				}.bind(this));

				//Sort the list


				return _.slice(articles,0,((this.state.page+1) * this.state.pageSize));
			} else {
				return [];
			}
		}
	};
}

function SpecialListFactory(name, route, listId){
	var loadList = function(){
		return ListActions.loadSpecialList(listId);
	}

	var getList = function(){
		return ListStore.getSpecialList(listId);
	}

	return ListFactory(name, route, loadList, getList);
}

function StaticListFactory(name, route, listId){
	var loadList = function(){
		return ListActions.loadList(listId);
	}

	var getList = function(){
		return ListStore.getList(listId);
	}

	return ListFactory(name, route, loadList, getList);
}

loaders[config.routes.saved] = SpecialListFactory('saved', config.routes.saved, 'saved');
loaders[config.routes.curated] = SpecialListFactory('curated', config.routes.curated, 'curated-external');

export default loaders;