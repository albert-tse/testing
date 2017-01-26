import React from 'react';
import { AppContent } from '../shared';
import { List, ListItem, ListSubHeader, Button } from 'react-toolbox';
import { Toolbars } from '../toolbar';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import FontIcon from 'react-toolbox/lib/font_icon';
import Styles from './styles';
import Typography from '../../../scss/typography';
import Config from '../../config';

class ConnectComponent extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            selectedInfluencer: parseInt(props.influencerId) || props.userData.user.influencers[0].id,
            choosingPlatform: false,
            step: props.step,
            profilePicture: props.profile_picture,
            profileName: props.profile_name
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            step: nextProps.step
        });
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
            step: 'none'
        });
    }

    selectPlatform(){
        this.setState({
            step: 'select_platform'
        });
    }

    selectPlatformProfile(profile){
        this.setState({
            platformProfileId: profile.id,
            step: 'confirm',
            profilePicture: profile.picture.data.url,
            profileName: profile.name
        });
    }

    setStep(step){
        this.setState({
            step: step
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
                    { ::this.renderRightPanel() }
                </div>
            </div>
        );
    }

    renderRightPanel() {
        var influencer = this.state.selectedInfluencer;
        var profileData = this.props.profiles;
        var influencerProfiles = _.filter(profileData.profiles, {influencer_id: influencer});

        if(this.state.step == 'confirm'){
            return this.renderConfirmLink();
        }else if(this.state.step == 'fb_page_select'){
            if(this.props.fbPages == 'loading'){
                return this.renderLoading();
            } else if(Array.isArray(this.props.fbPages) && this.props.fbPages.length > 0){
                return this.renderChooseFacebookPage(this.props.fbPages);
            } else {
                return <div>Tell them they have no pages to connect</div>;
            }
        }else if(this.state.step == 'select_platform'){
            return this.renderChoosePlatform(influencer);
        }else if(profileData.isLoading){
            return this.renderLoading();
        }else if(influencerProfiles.length > 0){
            return this.renderProfiles(influencer, profileData, influencerProfiles);
        }else{
            return this.renderConnectMore();
        }
    }

    renderLoading(){
        return (
            <List selectable>
                <ListSubHeader caption='Loading...' />
                <ProgressBar type="circular" mode="indeterminate" className={Styles.loader}/>
            </List>
        );
    }

    renderConnectMore(){
        return (
            <List selectable>
                <ListSubHeader caption='Connected a profile' />
                <div className={Styles.noProfiles}>
                    <FontIcon value='query_builder' className={Styles.clockIcon}/>
                    <p className={Styles.message}>
                        Connect your social profile to schedule posts using Contempo
                    </p>
                    <Button label='Connect' className={Styles.connectButton} onClick={::this.selectPlatform} />
                </div>
            </List>
        );
    }

    renderProfiles(){
        return (
            <List selectable>
                <ListSubHeader caption='Connected profiles' />
                <ListItem
                  leftIcon="add"
                  caption="Connect more"
                  legend="Profiles, pages, or boards"
                />
            </List>
        );
    }

    renderChoosePlatform(influencer){
        return (
            <List selectable>
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
            </List>
        );
    }

    renderChooseFacebookPage(pages){
        var comp = this;
        return (
            <List selectable>
                <ListSubHeader caption='Select Facebook Page' />
                {_.map(pages, function(el, i){
                    return (
                        <ListItem
                          leftIcon={<img src={el.picture.data.url} />}
                          caption={el.name}
                          legend={el.category}
                          onClick={function(){comp.selectPlatformProfile.bind(comp)(el)}}
                          key={i}
                        />
                    );
                })}
            </List>
        );
    }

    renderConfirmLink(){
        var comp = this;
        var influencer = _.find(this.props.userData.user.influencers, {id: parseInt(this.state.selectedInfluencer)});
        var influencer_img;

        if(influencer.fb_profile_image){
            influencer_img = <img src={influencer.fb_profile_image} />
        }else {
            influencer_img = <div>{influencer.name.substr(0,1).toUpperCase()}</div>
        }

        return (
            <div>
                <ListSubHeader caption='Confirm Link' />
                <div className={Styles.noProfiles}>
                    <div>
                        <div>
                            {influencer_img}
                            <span>{influencer.name}</span>
                        </div>
                        <FontIcon value='keyboard_backspace' className={Styles.clockIcon}/>
                        <div>
                            <img src={this.state.profilePicture} />
                            <span>{this.state.profileName}</span>
                        </div>
                    </div>
                    <p>
                        Do you want <b>{influencer.name}</b> to manage <b>{this.state.profileName}</b>
                    </p>
                    <Button label='Cancel' className={Styles.connectButton} onClick={() => (::this.setStep('none'))} accent />
                    <Button label='Connect' className={Styles.connectButton} onClick={function(){
                        comp.props.confirm(
                            comp.state.selectedInfluencer,
                            comp.state.platformProfileId,
                            comp.state.profilePicture,
                            comp.state.profileName
                        );
                    }} />
                </div>
            </div>
        );
    }

}

export default ConnectComponent;
