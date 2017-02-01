import React from 'react';
import AltContainer from 'alt-container';
import Component from './connect.component';
import UserStore from '../../stores/User.store';
import AuthStore from '../../stores/Auth.store';
import RouteStore from '../../stores/Route.store';
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

        //If we were passed Facebook connection details, fetch the profile's FBPages
        if(this.state.profile_id && this.state.platform_id && this.state.influencer_id){
            this.state.connectStep = 'confirm';

            if(this.state.platform_id == 2){
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
                        console.log(result);
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

    componentWillMount() {
        ProfileActions.loadProfiles();
    }

    onSubmit(e) {
        e.preventDefault();
    }

    confirmProfile(influencer_id, platform_profile_id, profile_picture, profile_name){
        this.setState({
            connectStep: 'confirming'
        });
        ProfileActions.confirmProfile(this.state.profile_id, influencer_id, platform_profile_id, profile_picture, profile_name);
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
                    authTypes: this.AuthTypes,
                    step: this.state.connectStep,
                    fbPages: this.state.fbPages,
                    profilePicture: this.state.profile_picture,
                    profileName: this.state.profile_name,
                    influencerId: this.state.influencer_id,
                    errorHash: this.state.hash,
                    confirm: () => (::this.confirmProfile)
                }}
                component={Component}
            >
            </AltContainer>
        );
    }

    AuthTypes = [{
        text: 'Facebook',
        fa: 'fa-facebook',
        action: function (influencer_id) {
            auth0social.login({
              connection: 'facebook',
              scope: 'openid name email',
              state: `influencer_id=${influencer_id}&token=${AuthStore.getState().token}`,
              prompt: 'login',
              connection_scope: Config.social.facebook_social_scope
            });
        }
    }, {
        text: 'Twitter',
        fa: 'fa-twitter',
        action: function (influencer_id) {
            auth0social.login({
              connection: 'twitter-scheduler',
              scope: 'openid name email',
              state: `influencer_id=${influencer_id}&token=${AuthStore.getState().token}`,
              prompt: 'login'
            });
        }
    }];
}

export default ConnectAccounts;
