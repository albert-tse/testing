import React from 'react';
import { AppContent } from '../shared';
import { List, ListItem, ListSubHeader, Button } from 'react-toolbox';
import { Toolbars } from '../toolbar';
import Avatar from 'react-toolbox/lib/avatar';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import FontIcon from 'react-toolbox/lib/font_icon';
import Styles from './styles';
import Typography from '../../../scss/typography';
import Config from '../../config';

class ConnectComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedInfluencer: parseInt(props.influencerId) || props.userData.user.influencers[0].id,
            choosingPlatform: false,
            step: props.step,
            profilePicture: props.profilePicture,
            profileName: props.profileName,
            errorHash: props.errorHash
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

        var influencerList = this.props.userData.user.influencers.map(function(influencer, index){
            var picture = influencer.fb_profile_image;
            if(!picture){
                picture = <span>{influencer.name.substr(0,1)}</span>
            }

            return <ListItem
              avatar={picture}
              caption={influencer.name}
              key={influencer.id}
              onClick={function(event){ component.selectedInfluencer(influencer.id) }} 
              className={Styles.influencer + ' ' + (this.state.selectedInfluencer == influencer.id ? Styles.selectedInfluencer : '')}
            />;
        }.bind(this));

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

        if(this.state.step == 'general_error'){
            return this.renderErrorScreen();
        }else if(this.state.step == 'confirm'){
            return this.renderConfirmLink();
        }else if(this.state.step == 'fb_page_select'){
            if(this.props.fbPages == 'loading'){
                return this.renderLoading();
            } else if(Array.isArray(this.props.fbPages) && this.props.fbPages.length > 0){
                return this.renderChooseFacebookPage(this.props.fbPages);
            } else {
                return this.renderFBErrorScreen();
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

    renderErrorScreen(){
        return (
            <List selectable>
                <ListSubHeader caption='Link Error' />
                <div className={Styles.noProfiles}>
                    <FontIcon value='error_outline' className={Styles.clockIcon}/>
                    <p className={Styles.message}>
                        There was an error linking your social profile. Please try again. If this problem persists, please contact support. ({this.state.errorHash})
                    </p>
                    <Button label='Dismiss' className={Styles.connectButton} onClick={() => (::this.setStep('none'))} />
                </div>
            </List>
        );
    }

    renderFBErrorScreen(){
        return (
            <List selectable>
                <ListSubHeader caption='Link Error' />
                <div className={Styles.noProfiles}>
                    <FontIcon value='error_outline' className={Styles.clockIcon}/>
                    <p className={Styles.message}>
                        There was a problem accessing your Facebook pages. Please ensure that this Facebook account is the administrator of at least one page. For further assistance, please contact support.
                    </p>
                    <Button label='Dismiss' className={Styles.connectButton} onClick={() => (::this.setStep('none'))} />
                </div>
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

    renderProfiles(influencer, profileData, influencerProfiles){
        return (
            <List selectable>
                <ListSubHeader caption='Connected profiles' />
                {_.map(influencerProfiles, function(el, i){
                    return (
                        <ListItem
                          avatar={el.profile_picture}
                          caption={el.profile_name}
                          legend={ el.platform_id == 1 ? 'Twitter' : 'Facebook'}
                          key={i}
                        />
                    );
                })}
                <ListItem
                  leftIcon="add"
                  caption="Connect more"
                  legend="Profiles, pages, or boards"
                  onClick={() => (::this.setStep('select_platform'))}
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
                          avatar={el.picture.data.url}
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
            influencer_img = influencer.fb_profile_image;
        }else {
            influencer_img = <div>{influencer.name.substr(0,1).toUpperCase()}</div>
        }

        return (
            <div>
                <ListSubHeader caption='Confirm Link' />
                <div className={Styles.confirm}>
                    <p>
                        Do you want <b>{influencer.name}</b> to manage <b>{this.state.profileName}</b>
                    </p>
                    <div className={Styles.preview}>
                        <div className={Styles.profile}>
                            <Avatar image={influencer_img}/>
                            <span>{influencer.name}</span>
                        </div>
                        <FontIcon className={Styles.arrow} value='keyboard_arrow_down' className={Styles.clockIcon}/>
                        <div className={Styles.influ}>
                            <Avatar image={this.state.profilePicture}/>
                            <span>{this.state.profileName}</span>
                        </div>
                    </div>
                    <Button label='Cancel' className={Styles.cancelButton} onClick={() => (::this.setStep('none'))} accent />
                    <Button label='Connect' className={Styles.confirmButton} onClick={function(){
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
