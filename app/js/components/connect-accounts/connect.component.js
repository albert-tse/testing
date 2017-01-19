import React from 'react';
import { AppContent } from '../shared';
import { List, ListItem, ListSubHeader, Button } from 'react-toolbox';
import { Toolbars } from '../toolbar';
import UserStore from '../../stores/User.store';
import Styles from './styles';
import Typography from '../../../scss/typography';

class ConnectComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedInfluencer: null
        };
    }

    componentDidUpdate() {
        
    }

    render() {
        return (
            <div>
                <Toolbars.ConnectAccounts />
                <AppContent id="ConnectAccounts">
                    {this.renderContent()}
                </AppContent>
            </div>
        );
    }

    selectedInfluencer(id) {
        console.log('Selected Influencer', id);
        this.selectedInfluencer = id;
    }

    renderContent() {

        console.log(this.props);

        var influencerList = this.props.user.influencers.map((influencer, index) => (
                    <ListItem
                      avatar={influencer.fb_profile_image}
                      caption={influencer.name}
                      key={influencer.id}
                      onClick={evt => this.selectedInfluencer(influencer.id)} 
                    />
                    ));

        return (
            <div id="connect-account" className={Styles.container}>
                <div className={Styles.influencerList}>
                    <List selectable>
                        <ListSubHeader caption='Influencers' />
                        {influencerList}
                    </List>
                </div>
                <div className={Styles.rightPanel}>
                    <div className={Styles.platformSelector}>
                    </div>
                </div>
            </div>
        );
    }

}

export default ConnectComponent;
