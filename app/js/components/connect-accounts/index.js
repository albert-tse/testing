import React from 'react';
import AltContainer from 'alt-container';
import Component from './connect.component';
import UserStore from '../../stores/User.store';
import AuthStore from '../../stores/Auth.store';
import ProfileStore from '../../stores/Profile.store';
import ProfileSource from '../../sources/Profile.source';
import ProfileActions from '../../actions/Profile.action';
import Config from '../../config';

const getFBPages = ProfileSource.getFBPages();
const confirmProfile = ProfileSource.confirmProfile();

class ConnectAccounts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...props.route.state};

        this.state.connectStep = 'none';

        if (this.state.profile_id && this.state.platform_id && this.state.influencer_id) {
            //If we were passed Facebook connection details, fetch the profile's FBPages
            this.state.connectStep = 'confirm';

            if(this.state.platform_id == 2 && !this.state.reconnecting){
                var comp = this;
                this.state.fbPages = 'loading';
                this.state.connectStep = 'fb_page_select';
                getFBPages.remote(this.state.profile_id)
                    .then(function(result){
                        comp.setState({
                            fbPages: result
                        });
                    })
                    .catch(function(result){
                        comp.setState({
                            fbPages: result
                        });
                    });
            }
        }

        if(this.state.error){
            this.state.connectStep = 'general_error';
        }
    }

    componentDidMount() {
        ProfileActions.loadProfiles();
    }

    onSubmit(e) {
        e.preventDefault();
    }

    confirmProfile(influencer_id, platform_profile_id, profile_picture, profile_name){
        const { profile_id } = this.state;
        this.setState({
            connectStep: 'confirming',
            profile_id: null,
            platform_id: null,
            influencer_id: null
        }, () => {
            ProfileActions.confirmProfile(profile_id, influencer_id, platform_profile_id, profile_picture, profile_name);
        });
    }

    deleteProfile(profile_id){
        this.setState({
            connectStep: 'deleting'
        });
        ProfileActions.deleteProfile(profile_id);
    }

    render() {
        return (
            <AltContainer
                stores={{
                    userData: props => ({
                        store: UserStore,
                        value: UserStore.getState()
                    }),
                    profiles: props => ({
                        store: ProfileStore,
                        value: ProfileStore.getState()
                    })
                }}
                inject={{
                    reconnectingProfileId: parseInt(this.state.profile_id) || -1,
                    reconnecting: this.state.reconnecting,
                    authTypes: this.AuthTypes,
                    step: this.state.connectStep,
                    fbPages: this.state.fbPages,
                    profilePicture: this.state.profile_picture,
                    profileName: this.state.profile_name,
                    platformProfileId: this.state.platform_profile_id,
                    influencerId: this.state.influencer_id,
                    errorHash: this.state.hash,
                    confirm: () => (::this.confirmProfile),
                    delete: () => (::this.deleteProfile)
                }}
                component={Component}
            >
            </AltContainer>
        );
    }

    // TODO DRY here
    AuthTypes = [{
        text: 'Facebook',
        title: 'Connect your Page',
        fa: 'fa-facebook',
        action: function (influencer_id, profile_id = -1, platform_profile_id = -1, profile_name, profile_picture) {
            let state = `influencer_id=${influencer_id}&token=${AuthStore.getState().token}`;
            if (profile_id > -1 && platform_profile_id > -1) {
                state = `reconnecting=true&profile_id=${profile_id}&platform_profile_id=${platform_profile_id}&${state}`;
            }

            auth0social.login({
              state,
              connection: 'facebook',
              scope: 'openid name email',
              prompt: 'login',
              connection_scope: Config.social.facebook_social_scope
            });
        }
    }, {
        text: 'Twitter',
        fa: 'fa-twitter',
        title: 'Connect your Profile',
        action: function (influencer_id, profile_id = -1, platform_profile_id = -1, profile_name, profile_picture) {
            let state = `influencer_id=${influencer_id}&token=${AuthStore.getState().token}`;
            if (profile_id > -1 && platform_profile_id > -1) {
                state = `reconnecting=true&profile_id=${profile_id}&platform_profile_id=${platform_profile_id}&${state}`;
            }

            auth0social.login({
              state,
              connection: 'twitter-scheduler',
              scope: 'openid name email',
              prompt: 'login'
            });
        }
    }];
}

export default ConnectAccounts;
