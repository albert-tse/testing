import React from 'react';

/**
 * How to use this:
 * TODO: specify the props a container should pass to this component to properly render
 */
class InfoBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var classNames = [
            this.props.store.show && 'slide-in'
        ].filter(Boolean).join(' ');

        return (
            <aside id="info-bar" className={classNames}>
                <i className="fa fa-times" onClick={this.hide.bind(this)}></i>
            </aside>
        );
        
        // { this.renderInfo(this.state.article) }
    }

    /**
     * Hide this component from the view
     */
    hide() {
        this.props.toggle(false);
    }

    /*
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
    */

    /**
     * If there are stats, render it
     * @param Array | undefined influencers who shared the link to the article
     * @return React.DOM
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
     */

    /**
     * Update the state of this component via model
     * @param InfoBarStore store that was updated
    update(store) {
        this.setState({
            article: store,
            show: true
        });
    }
     */
}

export default InfoBar;
