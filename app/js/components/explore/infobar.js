import React from 'react';
import InfoBarActions from '../../actions/InfoBar.action.js';
import InfoBarStore from '../../stores/InfoBar.store.js';

class InfoBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false
        };

        InfoBarStore.listen(this.update.bind(this));
    }

    render() {
        var classNames = [
            this.state.show && 'slide-in'
        ].filter(Boolean).join(' ');

        return (
            <aside id="info-bar" className={classNames}>
                <i className="fa fa-times" onClick={this.hide.bind(this)}></i>
                { this.renderInfo(this.state.article) }
            </aside>
        );
    }

    renderInfo(article) {
        if (article) {
            return (
                <div>
                    <h3 className="title">{article.title}</h3>
                    <h4 className="source">{article.site}</h4>
                    {this.renderStatsTable(article.influencers)}
                </div>
            );
        }
    }

    /**
     * If there are stats, render it
     * @param Array | undefined influencers who shared the link to the article
     * @return React.DOM
     */
    renderStatsTable(influencers) {
        if (influencers.length > 0) {
            // var influencers = _.groupBy(influencers, 'partner_id');
            
            return (
                <div id="feedStats">
                    <table id="statsTable">
                        <tbody id="statsBody"></tbody>
                    </table>
                </div>
            );
        }
    }

    /**
     * Hide this component from the view
     */
    hide() {
        InfoBarActions.show({ title: 'How are you?', source: 'TNW.com' });
        this.setState({ show: false });
    }

    /**
     * Update the state of this component via model
     * @param InfoBarStore store that was updated
     */
    update(store) {
        this.setState({
            article: store,
            show: true
        });
    }
}

export default InfoBar;
