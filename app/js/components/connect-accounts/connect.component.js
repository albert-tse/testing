import React from 'react';
import { AppContent } from '../shared';
import { Button, IconButton, List, ListItem, ListSubHeader } from 'react-toolbox';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import FontIcon from 'react-toolbox/lib/font_icon';
import Avatar from 'react-toolbox/lib/avatar';
import classnames from 'classnames';

import { Toolbars } from '../toolbar';
import { filter } from 'lodash';
import Styles from './styles';
import Typography from '../../../scss/typography';
import Config from '../../config';

export default class ConnectComponent extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            selectedInfluencer: parseInt(props.influencerId) || props.userData.user.influencers[0].id,
            choosingPlatform: false,
            step: props.step,
            profilePicture: props.profilePicture,
            profileName: props.profileName,
            platformProfileId: props.platformProfileId,
            errorHash: props.errorHash
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            step: nextProps.step
        });
    }

    componentDidUpdate() {
        if (this.props.profiles.confirmedProfile) {
            window.location.reload()
        }
    }

    render() {
        return (
            <div>
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

            const hasInvalidProfiles = filter(this.props.profiles.profiles, { influencer_id: influencer.id, token_error: 1 }).length > 0;

            return (
                <ListItem
                    key={influencer.id}
                    avatar={picture}
                    caption={influencer.name}
                    onClick={function(event){ component.selectedInfluencer(influencer.id) }}
                    className={classnames(
                        Styles.influencer + ' ' + (this.state.selectedInfluencer == influencer.id ? Styles.selectedInfluencer : ''),
                        hasInvalidProfiles && Styles.hasInvalidProfiles
                    )}
                />
            );
        }.bind(this));

        return (
            <div className={Styles.container}>
                <h1 className={Styles.heading}>Manage Profiles</h1>
                <div id="connect-account" className={Styles.dialog}>
                    <div className={Styles.influencerList}>
                        <List selectable>
                            <ListSubHeader caption='Influencers' />
                            {influencerList}
                        </List>
                    </div>
                    <div className={Styles.rightPanel}>
                        { this.renderRightPanel() }
                    </div>
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
                return this.renderChooseFacebookPage(this.props.fbPages, influencerProfiles);
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
                <div className={Styles.noProfiles}>
                    <FontIcon value='query_builder' className={Styles.clockIcon}/>
                    <p className={Styles.message}>
                        Manage and schedule your posts to Facebook and Twitter directly from Contempo! Connect as many pages or profiles as you like.
                    </p>
                    <Button label="Connect" raised accent className={Styles.connectButton} onClick={::this.selectPlatform} />
                </div>
            </List>
        );
    }

    // TODO Need to hook up the resync button to Auth0
    renderProfiles(influencer, profileData, influencerProfiles){
        var comp = this;
        return (
            <List selectable>
                <ListSubHeader caption='Connected Profiles' />
                {_.map(influencerProfiles, (profile, index) => {
                    const removeIcon = (
                        <div className={Styles.actionButtons}>
                            <IconButton
                                icon="clear"
                                className={Styles.removeButton}
                                onClick={evt => this.props.delete(profile.id)}
                            />
                            {profile.token_error > 0 && (
                                <IconButton
                                    icon="sync"
                                    className={Styles.invalidProfile}
                                    onClick={this.reconnectProfile(profile, this.props.authTypes)}
                                />
                            )}
                        </div>
                    )

                    return (
                        <ListItem
                          key={index}
                          avatar={profile.profile_picture}
                          caption={profile.profile_name}
                          legend={profile.platform_id == 1 ? 'Twitter' : 'Facebook'}
                          className={classnames(Styles.profileListItem, profile.token_error > 0 && Styles.invalidProfile)}
                          rightIcon={removeIcon}
                        />
                    );
                })}
                <ListItem
                  leftIcon="add"
                  caption="Connect more"
                  legend="Pages or Profiles"
                  onClick={() => (::this.setStep('select_platform'))}
                />
            </List>
        );
    }

    renderChoosePlatform(influencer){
        return (
            <List className={Styles.platforms} selectable>
                <ListSubHeader caption="Choose a platform" />
                {
                    this.props.authTypes.map(function(el, i){
                        return (
                            <ListItem
                              leftIcon={<i className={ `fa ${el.fa}` } />}
                              caption={el.text}
                              legend={el.title}
                              onClick={function(){el.action(influencer)}}
                              key={i}
                            />
                        );
                    })
                }
            </List>
        );
    }

    renderChooseFacebookPage(availablePages, currentProfiles){
        var comp = this;
        var influencer = _.find(this.props.userData.user.influencers, { id: parseInt(this.state.selectedInfluencer) });

        // Filter the available FB pages for this user by any FB pages they have already connected to this influencer
        var filteredList = _.differenceWith(availablePages, currentProfiles, (val, current) => {
            return val.id === current.platform_profile_id && current.platform_id === 2;
        });

        if(filteredList.length > 0){
            return (
                <div>
                    <List selectable>
                        <ListSubHeader caption='Select Facebook Page for' />
                        <header className={Styles.prompt}>
                            {influencer.name}
                        </header>
                        {_.map(filteredList, function(el, i){
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
                </div>
            );
        } else {
            return (
                <List selectable>
                    <ListSubHeader caption='Link Error' />
                    <div className={Styles.noProfiles}>
                        <FontIcon value='error_outline' className={Styles.clockIcon}/>
                        <p className={Styles.message}>
                            It looks like you have already connected all your Facebook pages to this influencer. Please ensure that you are connecting to the correct influencer or that this Facebook account is the administrator of the page you would like to connect. For further assistance, please contact support.
                        </p>
                        <Button label='Dismiss' className={Styles.connectButton} onClick={() => (::this.setStep('none'))} />
                    </div>
                </List>
            );
        }
    }

    renderConfirmLink(){
        var comp = this;
        var influencer = _.find(this.props.userData.user.influencers, {id: parseInt(this.state.selectedInfluencer)});
        var influencer_img;
        if (influencer.fb_profile_image){
            influencer_img = influencer.fb_profile_image;
        } else {
            influencer_img = <div>{influencer.name.substr(0,1).toUpperCase()}</div>
        }

        return (
            <div>
                <ListSubHeader caption='Confirm Link' />
                <div className={Styles.confirm}>
                    <header className={Styles.prompt}>
                        Do you want <span>{influencer.name}</span> to manage <span>{this.state.profileName}</span>
                    </header>
                    <div className={Styles.preview}>
                        <div className={Styles.profile}>
                            <Avatar image={influencer_img}/>
                            <span className={Styles.influencerName}>{influencer.name}</span>
                        </div>
                        <FontIcon className={Styles.arrow} value="arrow_forward" />
                        <div>
                            <Avatar image={this.state.profilePicture}/>
                            <span className={Styles.influencerName}>{this.state.profileName}</span>
                        </div>
                    </div>
                    <div className={Styles.actions}>
                        <Button label='Cancel' neutral={false} onClick={() => (::this.setStep('none'))} accent />
                        <Button label='Connect' raised accent onClick={() => {
                            comp.props.confirm(
                                comp.state.selectedInfluencer,
                                comp.state.platformProfileId,
                                comp.state.profilePicture,
                                comp.state.profileName
                            );
                        }} />
                    </div>
                </div>
            </div>
        );
    }

    reconnectProfile = (profile, authTypes) => evt => {
        const {
            id,
            influencer_id,
            platform_id,
            platform_profile_id,
            profile_name,
            profile_picture
        } = profile;

        const platform = Config.platforms[platform_id];

        if (Object.keys(platform).includes('name')) {
            const authType = _.find(authTypes, { text: platform.name });
            if (Object.keys(authType).includes('action') && typeof authType.action === 'function') {
                authType.action(influencer_id, id, platform_profile_id, profile_name, profile_picture)
            }
        }
    }

}
