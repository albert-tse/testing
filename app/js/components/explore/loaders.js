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
	selection: 'Selection',
	
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

            if(!_.isEqual(prevFilters, nextFilters) && this.props.filters.ucids === filters.ucids) {
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

function ListFactory(name, route, loadList, getList, toolbar, selection){
	return {
		name: name,
		path: route,
		toolbar: toolbar,
		selection: selection,
		
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
				var filters = this.props.filters;

				//Filter the list
				var articles = _.filter(list.articles, function(el){
					if(this.props.filters){

						var site = _.find(filters.sites, {id: el.article_site_id});
						if(site && !site.enabled){
							return false;
						}

						var startTime = moment(filters.exploreDateRange.date_start);
						var endTime = moment(filters.exploreDateRange.date_end);
						if(
							!moment(el.article_added_date)
								.isBetween(
									filters.exploreDateRange.date_start, 
									filters.exploreDateRange.date_end
								)
							)
						{
							return false;
						}
					}
					return true;
				}.bind(this));

				//Sort the list
				if(filters.sort == 'site_id desc') {
					articles = _.sortBy(articles, ['article_site_name']);
				} else if(filters.sort == 'title asc') {
					articles = _.sortBy(articles, ['article_title']);
				} else if(filters.sort == 'list added desc') {
					articles = _.chain(articles).sortBy(function(el){
						return moment(el.added_to_list_date).toDate();
					}).reverse().value();
				} else {
					// 'creation_date desc' and Unknown
					articles = _.chain(articles).sortBy(function(el){
						return moment(el.article_added_date).toDate();
					}).reverse().value();
				}

				return _.slice(articles,0,((this.state.page+1) * this.state.pageSize));
			} else {
				return [];
			}
		}
	};
}

function SpecialListFactory(name, route, listId){
	var loadList = function(){
        FilterActions.update({ selectedList: listId });
		return ListActions.loadSpecialList(listId);
	}

	var getList = function(){
		return ListStore.getSpecialList(listId);
	}

	var selection = 'ListSelection';
	if(listId == 'saved'){
		selection = 'SelectionOnSaved';
	}

	return ListFactory(name, route, loadList, getList, 'ListFilter', selection);
}

function StaticListFactory(name, route, listId){
	var loadList = function(){
        FilterActions.update({ selectedList: parseInt(listId) });
		return ListActions.load([listId]);
	}

	var getList = function(){
		return ListStore.getList(listId);
	}

	return ListFactory(name, route, loadList, getList, 'ListFilter', 'ListSelection');
}

loaders[config.routes.saved] = SpecialListFactory('saved', config.routes.saved, 'saved');
loaders[config.routes.curated] = SpecialListFactory('curated', config.routes.curated, 'curated-external');
loaders[config.routes.internalCurated] = SpecialListFactory('curated-internal', config.routes.internalCurated, 'curated-internal');
loaders[config.routes.list] = function(listId){
	return StaticListFactory('static-'+listId, config.routes.list, listId);
} 

export default loaders;
