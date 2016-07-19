import React from 'react';
import AltContainer from 'alt-container';
import moment from 'moment';
import Component from './SharedContent.component';
import { CellDataTypes } from './sharedLinks/SharedLinks.component';
import UserStore from '../../stores/User.store'
import InfluencerStore from '../../stores/Influencer.store'
import InfluencerActions from '../../actions/Influencer.action'
import FilterStore from '../../stores/Filter.store'
import FilterActions from '../../actions/Filter.action'
import { AppContent } from '../shared';
import { Toolbars } from '../toolbar';
import Config from '../../config';

var SharedToolbar = Toolbars.Shared;

class SharedContent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataModel: {
                title: {
                    label: 'Title',
                    dataProp: 'link_id',
                    dataType: CellDataTypes.link,
                    dataTransform: (input) => (::this.getTitleLink(input)),
                    isSearchable: true,
                    isSortable: false,
                    width: 400
                },
                site_name: {
                    label: 'Site',
                    dataProp: 'site_name',
                    sort: (event) => (::this.sortData(event, 'site_name')),
                    isSorted: false,
                    isDescending: false,
                    isSearchable: true,
                    width: 100
                },
                total_clicks: {
                    label: 'Clicks',
                    dataProp: 'total_clicks',
                    dataType: CellDataTypes.number,
                    sort: (event) => (::this.sortData(event, 'total_clicks')),
                    isSorted: false,
                    isDescending: false,
                    isSearchable: false,
                    width: 100
                },
                fb_reach: {
                    label: 'Reach',
                    dataProp: 'fb_reach',
                    dataType: CellDataTypes.number,
                    sort: (event) => (::this.sortData(event, 'fb_reach')),
                    isSorted: false,
                    isDescending: false,
                    isSearchable: false,
                    width: 100
                },
                ctr: {
                    label: 'CTR',
                    dataProp: 'ctr',
                    dataTransform: function (input) {
                        if (input == null) {
                            return input;
                        }
                        return input.toFixed(2) + '%';
                    },
                    sort: (event) => (::this.sortData(event, 'ctr')),
                    isSorted: false,
                    isDescending: false,
                    isSearchable: false,
                    width: 100
                },
                cpc: {
                    label: 'CPC',
                    dataProp: 'cpc',
                    dataType: CellDataTypes.dollars,
                    sort: (event) => (::this.sortData(event, 'cpc')),
                    isSorted: false,
                    isDescending: false,
                    isSearchable: false,
                    width: 95
                },
                shared_date: {
                    label: 'Published',
                    dataProp: 'shared_date',
                    dataType: CellDataTypes.date,
                    sort: (event) => (::this.sortData(event, 'shared_date')),
                    isSorted: false,
                    isDescending: false,
                    isSearchable: false,
                    width: 125
                },
                article: {
                    label: 'Article',
                    dataProp: 'ucid',
                    dataType: CellDataTypes.articleIcon,
                    dataTransform: function(input) {
                        return Config.routes.articles.replace(':ids', input);
                    },
                    isSortable: false,
                    width: 128
                },
                socialLink: {
                    label: '',
                    dataProp: 'link_id',
                    dataType: CellDataTypes.socialIcon,
                    dataTransform: (input) => (::this.getSocialLink(input)),
                    isSortable: false,
                    width: 50
                },
            },

            clickTotals: InfluencerStore.getState().searchedClickTotals,
            linkData: InfluencerStore.getState().searchedLinkTotals,
            filteredLinkData: _.cloneDeep(InfluencerStore.getState().searchedLinkTotals)
        };

        //TODO Move filter and sort into this comp
        //TODO listen to filter changes, and refresh accordingly
    }

    componentDidMount() {
        InfluencerActions.searchClicks();
        InfluencerActions.searchLinks();
        FilterStore.listen(::this.onFilterChange);
        UserStore.listen(::this.onInfluencerChange);
        InfluencerStore.listen(::this.onDataChange);
    }

    componentWillUnmount() {
        InfluencerStore.unlisten(::this.onDataChange);
        FilterStore.unlisten(::this.onFilterChange);
        UserStore.unlisten(::this.onInfluencerChange);
    }

    onInfluencerChange() {
        setTimeout(function () {
            InfluencerActions.searchClicks();
            InfluencerActions.searchLinks();
        }, 1);
    }

    onFilterChange() {
        var filters = FilterStore.getState();
        if (this.state.previousFilters) {
            var previousFilters = this.state.previousFilters;
            if (
                previousFilters.date_start != filters.date_start ||
                previousFilters.date_end != filters.date_end
            ) {
                setTimeout(function () {
                    InfluencerActions.searchClicks();
                    InfluencerActions.searchLinks();
                }, 1);
            }
        }

        this.updateData.bind(this)();
    }

    getTitleLink(linkId) {
        var link = _.find(this.state.filteredLinkData.links, function (dataRow) {
            return dataRow.link_id === linkId;
        });

        return {
            text: link.title,
            href: 'http://qklnk.co/' + link.hash,
        };
    }

    getSocialLink(linkId) {
        var link = _.find(this.state.filteredLinkData.links, function (dataRow) {
            return dataRow.link_id === linkId;
        });

        // TODO: Handle other platforms once we start collecting stats for those platforms
        return {
            platformId: link.platform_id,
            permalink: link.fb_permalink,
        };
    }

    onDataChange(state) {
        this.state.clickTotals = state.searchedClickTotals;
        this.state.linkData = state.searchedLinkTotals;
        this.updateData.bind(this)();
    }

    sortData(event, dataProp) {
        //Update Data Model
        var start = (new Date()).getTime();
        _.forEach(this.state.dataModel, function (el) {
            if (el.dataProp != dataProp) {
                el.isSorted = false;
                el.isDescending = false;
            }
        })

        if (this.state.dataModel[dataProp].isSorted) {
            this.state.dataModel[dataProp].isDescending = !this.state.dataModel[dataProp].isDescending;
        } else {
            this.state.dataModel[dataProp].isSorted = true;
            this.state.dataModel[dataProp].isDescending = false;
        }

        ::this.updateData();
    }

    updateData() {
        var filters = FilterStore.getState();

        //reset the filtered data
        this.state.filteredLinkData = _.cloneDeep(this.state.linkData);

        //Get the prop to sort by
        var sortModel = _.find(this.state.dataModel, function (el) {
            return el.isSorted;
        });
        //get a list of valid platforms
        var platforms = _.filter(filters.platforms, function (el) {
            return el.enabled != false;
        });
        var platformIds = _.map(platforms, 'id');

        //get a list of valid site id's
        var sites = _.filter(filters.sites, function (el) {
            return el.enabled != false;
        });
        var siteIds = _.map(sites, 'id');

        //Filter the results
        this.state.filteredLinkData.links = _.filter(this.state.filteredLinkData.links, function (dataRow) {
            var shouldShow = false;

            //Scan all searchable fields for any match. If found, show the result
            var FilterText = FilterStore.getState();
            if (filters.text) {
                _.each(this.state.dataModel, function (model) {
                    if (model.isSearchable && !shouldShow) {
                        var value = '' + dataRow[model.dataProp];
                        if (value.toLowerCase().indexOf(filters.text.toLowerCase()) != -1) {
                            shouldShow = true;
                        }
                    }
                }.bind(this));
            } else {
                shouldShow = true;
            }

            if (shouldShow && filters.platforms) {
                shouldShow = _.indexOf(platformIds, dataRow.platform_id) != -1;
            }

            if (shouldShow && filters.sites) {
                shouldShow = _.indexOf(siteIds, dataRow.site_id) != -1;
            }

            return shouldShow;
        }.bind(this));

        //Sort the actual data
        if (sortModel) {
            this.state.filteredLinkData.links = this.state.filteredLinkData.links.sort(function (a, b) {
                var propA = a[sortModel.dataProp];
                var propB = b[sortModel.dataProp];

                if (sortModel.dataType == CellDataTypes.date) {
                    propA = parseInt(moment(propA).format('x'));
                    propB = parseInt(moment(propB).format('x'));
                }

                //Regardless of asc or desc drop nulls to the bottom
                if ((propA == null || propA == '') && propB != null) {
                    return 1;
                }
                if ((propB == null || propB == '') && propA != null) {
                    return -1;
                }

                var lexFlip = 1; //When sorting lexicographically we want to invert the sort to A is high and Z is low
                if (typeof propA == 'string') {
                    lexFlip = -1;
                }

                if (propA > propB) {
                    return (sortModel.isDescending ? 1 : -1) * lexFlip;
                }
                if (propA < propB) {
                    return (sortModel.isDescending ? -1 : 1) * lexFlip;
                }
                return 0;
            });
        }

        this.state.previousFilters = filters;
        this.setState(this.state);
    }

    render() {
        return (
            <div>
                <SharedToolbar />
                <AppContent id="sharedlinks">
                    <AltContainer
                        stores={{

                        }}
                        component={ Component }
                        inject = {
                            {
                                dataModel: this.state.dataModel,
                                linkData: this.state.filteredLinkData,
                                clickData: this.state.clickTotals
                            }
                        }
                    />
                </AppContent>
            </div>
        );
    }
}

export default SharedContent
