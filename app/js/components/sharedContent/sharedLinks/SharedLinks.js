import React from 'react';
import AltContainer from 'alt-container';
import moment from 'moment'
import Config from '../../../config'
import Component from './SharedLinks.component';
import History from '../history'
import { CellDataTypes } from './SharedLinks.component';
import InfluencerStore from '../../../stores/Influencer.store'
import InfluencerActions from '../../../actions/Influencer.action'

class SharedLinks extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataModel: {
                title: {
                    label: 'Title',
                    dataProp: 'title',
                    sort: (event) => (::this.sortData(event, 'title')),
                    isSorted: false,
                    isDescending: false,
                    isSearchable: true,
                    width: 300
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
                hash: {
                    label: 'URL',
                    dataProp: 'hash',
                    dataType: CellDataTypes.link,
                    dataTransform: function(input) {
                        return 'http://qklnk.co/' + input;
                    },
                    sort: (event) => (::this.sortData(event, 'hash')),
                    isSorted: false,
                    isDescending: false,
                    isSearchable: true,
                    width: 205
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
                    dataTransform: function(input) {
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
                saved_date: {
                    label: 'Saved',
                    dataProp: 'saved_date',
                    dataType: CellDataTypes.date,
                    sort: (event) => (::this.sortData(event, 'saved_date')),
                    isSorted: false,
                    isDescending: false,
                    isSearchable: false,
                    width: 100
                },
                published_date: {
                    label: 'Published',
                    dataProp: 'published_date',
                    dataType: CellDataTypes.date,
                    sort: (event) => (::this.sortData(event, 'published_date')),
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
                        return History.createHref(Config.routes.articles).replace(':ids', input);
                    },
                    isSortable: false,
                    width: 128
                },
            },
            data: test_data.links,
            filteredData: test_data.links
        };
    }

    componentDidMount() {}

    sortData(event, dataProp) {
        //Update Data Model
        var start = (new Date()).getTime();
        _.forEach(this.state.dataModel, function(el) {
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

    filterData(event) {
        this.state.filter = event.target.value;

        ::this.updateData();
    }

    filterBarChange(event, section_id, filter_id) {
        var filterSection = _.find(this.state.filters, function(el) {
            return el.id == section_id;
        });
        var filter = _.find(filterSection.filters, { id: filter_id });
        filter.disabled = !filter.disabled;

        ::this.updateData();
    }

    updateData() {
        //reset the filtered data
        this.state.filteredData = this.state.data;

        //Get the prop to sort by
        var sortModel = _.find(this.state.dataModel, function(el) {
            return el.isSorted;
        });

        //get a list of valid platforms
        var platforms = _.filter(this.state.filters[0].filters, function(el) {
            return !el.disabled;
        });
        var platformIds = _.map(platforms, 'id');

        //get a list of valid site id's
        var sites = _.filter(this.state.filters[1].filters, function(el) {
            return !el.disabled;
        });
        var siteIds = _.map(sites, 'id');

        //Filter the results
        this.state.filteredData = _.filter(this.state.filteredData, function(dataRow) {
            var shouldShow = false;

            //Scan all searchable fields for any match. If found, show the result
            if (this.state.filter) {
                _.each(this.state.dataModel, function(model) {
                    if (model.isSearchable && !shouldShow) {
                        var value = '' + dataRow[model.dataProp];
                        if (value.toLowerCase().indexOf(this.state.filter.toLowerCase()) != -1) {
                            shouldShow = true;
                        }
                    }
                }.bind(this));
            } else {
                shouldShow = true;
            }

            if (shouldShow) {
                shouldShow = _.contains(platformIds, dataRow.platform_id);
            }

            if (shouldShow) {
                shouldShow = _.contains(siteIds, dataRow.site_id);
            }

            return shouldShow;
        }.bind(this));

        //Sort the actual data
        if (sortModel) {
            this.state.filteredData = this.state.filteredData.sort(function(a, b) {
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
        this.setState(this.state);
    }

    render() {
        return (
            <FiltersSidebar 
                handler={ ::this.filterBarChange }
                filters={ this.state.filters } >
                <AltContainer listName = "SharedLinks"
                        component = { Component }
                        inject = {
                            {
                                links: this.state.filteredData,
                                dataModel: this.state.dataModel,
                                search: () => (::this.filterData)
                            }
                        }
                        />
            </FiltersSidebar>
        );
    }
}

export default SharedLinks;
