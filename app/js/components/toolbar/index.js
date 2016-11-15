import React from 'react';
import { Button } from 'react-toolbox';
import Toolbar from './Toolbar.component';
import MobileToolbar from './MobileToolbar.component';
import SearchActions from '../../actions/Search.action';
import InfluencerStore from '../../stores/Influencer.store';
import InfluencerActions from '../../actions/Influencer.action';
import defer from 'lodash/defer';
import Styles from './styles';
import classnames from 'classnames';
import { ArticleSorter,
    BatchSaveLinks,
    ClearSelectionButton,
    AnalyticsDateRangeFilter,
    DownloadCSV,
    ExploreDateRangeFilter,
    InfluencerFilter,
    Keywords,
    MonthSelector,
    MultiSelectListDropdown,
    PlatformFilter,
    SaveArticles,
    SharePermalinkButton,
    SitesFilter,
    UsedSitesFilter,
    TopicFilter,
    AnalyticsMenu,
    RemoveFromListButton
} from './toolbar_components';
import AddToListButton from '../shared/article/AddToListButton.component'

const createToolbar = function (props) {

    let mobileToolbar = false;

    if (props.mobileCollapse) {
        mobileToolbar = <MobileToolbar {...props} className={Styles.mobileToolbar} />
    }

    return React.createClass({
        render: function () {
            return (
                <div className={Styles.responsiveToolbar}>
                    <Toolbar {...props} />
                    {mobileToolbar}
                </div>
            );
        }
    });
};

exports.Toolbars = {
    Selection: createToolbar({
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            <SaveArticles key="0" />,
            <AddToListButton key="1" ucid={-1}/>,
            <SharePermalinkButton key="2" />,
            <BatchSaveLinks key="3" />
        ]
    }),

    ListSelection: createToolbar({
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            <SaveArticles key="0" />,
            <RemoveFromListButton key="1"/>,
            <AddToListButton key="2" ucid={-1}/>,
            <SharePermalinkButton key="3" />,
            <BatchSaveLinks key="4" />
        ]
    }),

    SelectionOnSaved: createToolbar({
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            <SaveArticles key="0" label="Remove From My Posts" />,
            <SharePermalinkButton key="1" />,
            <BatchSaveLinks key="2" />
        ]
    }),

    Filter: createToolbar({
        mobileCollapse: true,
        className: classnames(Styles.filterToolbar, Styles.desktopToolbar),
        mobileTitle: 'Filter',
        flat: true,
        left: [
            <ArticleSorter key="1" />,
            <ExploreDateRangeFilter key="2" />,
            <SitesFilter key="3" />
        ],
        right: [
            <Keywords key="0" />
        ]
    }),

    ListFilter: createToolbar({
        mobileCollapse: true,
        mobileTitle: 'Filter',
        left: [
            <ArticleSorter key="1" sortOptions="list"/>,
            <ExploreDateRangeFilter key="2" />,
            <SitesFilter key="3" />
        ],
        right: [
            <Keywords key="0" placeholder="Filter"/>
        ]
    }),

    Articles: createToolbar({
        left: 'Articles'
    }),

    Links: createToolbar({
        left: [
            <AnalyticsDateRangeFilter key="0" />,
            <SitesFilter key="1" />
        ]
    }),

    Related: createToolbar({
        left: 'Related Articles'
    }),

    Settings: createToolbar({
        left: 'User Settings'
    }),

    Analytics: createToolbar({
        mobileCollapse: true,
        mobileTitle: 'Filter',
        left: [
            <InfluencerFilter icon="share" key="0"/>,
            <AnalyticsDateRangeFilter key="1" />,
            <UsedSitesFilter key="2" />,
            <PlatformFilter key="3" />
        ],
        leftNoCollapse: [
            <AnalyticsMenu key="0" />
        ]
    }),

    Accounting: createToolbar({
        mobileCollapse: true,
        mobileTitle: 'Filters',
        left: [
            <MonthSelector key="0" />
        ],
        leftNoCollapse: [
            <AnalyticsMenu key="0" />
        ],
        right: [
            <DownloadCSV key="0" />
        ]
    })
};

export SelectableToolbar from './SelectableToolbar.component';
export default Toolbar;
