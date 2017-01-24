import React from 'react';
import { AppContent } from '../shared';
import { List, ListItem, ListSubHeader, Button } from 'react-toolbox';
import { Toolbars } from '../toolbar';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import FontIcon from 'react-toolbox/lib/font_icon';
import Styles from './styles';
import Typography from '../../../scss/typography';

class ConnectComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedInfluencer: props.userData.user.influencers[0].id,
            choosingPlatform: false
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
        this.setState({
            selectedInfluencer:id,
            choosingPlatform: false
        });
    }

    selectPlatform(){
        this.setState({
            choosingPlatform: true
        });
    }

    renderContent() {
        var component = this;

        var influencerList = this.props.userData.user.influencers.map((influencer, index) => (
                    <ListItem
                      avatar={influencer.fb_profile_image}
                      caption={influencer.name}
                      key={influencer.id}
                      onClick={function(event){ component.selectedInfluencer(influencer.id) }} 
                      className={this.state.selectedInfluencer == influencer.id ? Styles.selectedInfluencer : ''}
                    />
                    ));

        var profileList = this.props.userData.user.influencers.map((influencer, index) => (
                    <ListItem
                      avatar={influencer.fb_profile_image}
                      caption={influencer.name}
                      key={influencer.id}
                      onClick={function(event){ component.selectedInfluencer(influencer.id) }} 
                      className={this.state.selectedInfluencer == influencer.id ? Styles.selectedInfluencer : ''}
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
                    <List selectable>
                        { ::this.renderRightPanel() }

                    </List>
                </div>
            </div>
        );
    }

    renderRightPanel() {
        var influencer = this.state.selectedInfluencer;
        var profileData = this.props.profiles;

        if(this.state.choosingPlatform){
            console.log(this.props.authTypes);
            return (
                <div className={Styles.platforms}>
                    <ListSubHeader caption='Connect a platform' />
                    { 
                        this.props.authTypes.map(function(el, i){
                            return (
                                <ListItem
                                  leftIcon={<i className={ `fa fa-lg ${el.fa}` } />}
                                  caption={el.text}
                                  onClick={function(){el.action(influencer)}}
                                  key={i}
                                />
                            );
                        })
                    }
                </div>
            );
        }else{
            if(profileData.isLoading){
                return (
                    <div>
                        <ListSubHeader caption='Connected platforms' />
                        <ProgressBar type="circular" mode="indeterminate" className={Styles.loader}/>
                    </div>
                );
            }else{
                var influencerProfiles = _.filter(profileData.profiles, {influencer_id: influencer});
                if(influencerProfiles.length <= 0){
                    return (
                        <div>
                            <ListSubHeader caption='Connected a profile' />
                            <div className={Styles.noProfiles}>
                                <FontIcon value='query_builder' className={Styles.clockIcon}/>
                                <p className={Styles.message}>
                                    Connect your social progile to schedule posts using Contempo
                                </p>
                                <Button label='Connect' className={Styles.connectButton} onClick={::this.selectPlatform} />
                            </div>
                        </div>
                    );
                }else{
                    return (
                        <div>
                            <ListSubHeader caption='Connected profiles' />
                            <ListItem
                              leftIcon="add"
                              caption="Connect more"
                              legend="Profiles, pages, or boards"
                            />
                        </div>
                    );
                }
            }
        }
    }

}

export default ConnectComponent;
