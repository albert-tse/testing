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
    }

    /** Load user-created lists */
    componentWillMount() {
        ProfileActions.loadProfiles();
    }

    onSubmit(e) {
        e.preventDefault();
    }

    render() {
        console.log(this.props);
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
                    authTypes: this.AuthTypes
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
