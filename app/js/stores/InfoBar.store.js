import alt from '../alt';
import InfoBarActions from '../actions/InfoBar.action';
import Config from '../config'

class InfoBarStore {

    constructor() {
        this.bindAction(InfoBarActions.toggle, this.toggle);
        this.show = false;
    }

    /**
     * Replaces the content of the info bar with the new article
     * and stats information passed in the action
     * @param Object content
     */
    toggle(content) {
        if (!content) {
            return this.setState({
                show: false
            });
        }

        var influencers = [];
        var statsGroupedByInfluencer = _.groupBy(content.stats, 'partner_id'); // TODO: change this to influencer_name once we get this to production

        for (var influencer in statsGroupedByInfluencer) { // TODO: change to influencer_name
            influencers.push({
                name: influencer,
                platforms: statsGroupedByInfluencer[influencer].map(formatPlatformStats)
            });
        }

        // TODO: add some data validation here before changing the state
        return this.setState({
            show: true,
            title: content.title,
            site: content.site,
            influencers: influencers
        });
    }
}

/**
 * Filter out the data the info bar component doesn't need to know about
 * @param Object platform that has stats data
 * @return Object platform object with just the data the component needs to display
 */
function formatPlatformStats(platform) {
    platform = _.pick(platform, 'hash', 'platform_id', 'stats');
    return _.extend(platform, {
        shortlink: Config.shortlinkHostname + platform.hash,
        name: feed.platforms.names[platform.platform_id] // TODO: update this to get the state of the Feed store for the platform names
    });
}

export default alt.createStore(InfoBarStore, 'InfoBarStore');
