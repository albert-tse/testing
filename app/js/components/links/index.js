import React from 'react';
import AltContainer from 'alt-container';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Table from 'react-toolbox/lib/table';
import { AppContent, ArticleView } from '../shared';
import LinkStore from '../../stores/Link.store'
import LinkActions from '../../actions/Link.action'
import { Toolbars } from '../toolbar';

var Toolbar = Toolbars.Links;

const DataModel = {
    title: { type: String },
    shortlink: { type: String },
    saved_date: { type: Date }
};

class Links extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        LinkActions.fetchLinks();
    }

    renderLinksTable(links) {
        return (
            <Table
                model={DataModel}
                source={links}
              />
        );
    }

    render() {
        return (
            <AltContainer 
                stores={{
                    links: props => ({
                        store: LinkStore,
                        value: LinkStore.getState().searchResults
                    })
                }}
                render={ props => (
                    <div>
                        <Toolbar />
                        <AppContent id="Links">
                            { props.links.length == 0 ? 
                                <ProgressBar type="circular" mode="indeterminate" /> : 
                                ::this.renderLinksTable(props.links)
                            }
                        </AppContent>
                    </div>
                ) } 
            />
        );
    }
}

export default Links;