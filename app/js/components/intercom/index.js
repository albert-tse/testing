import React from 'react'
import sha256 from 'js-sha256'

import Config from '../../config'
import UserStore from '../../stores/User.store'

export default class Intercom extends React.PureComponent {
    componentDidMount() {
        const { user } = UserStore.getState()
        try {
            (function(u) {
                var w = window;
                w.intercomSettings = {
                    app_id: Config.intercom.appId,
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    created_at: new Date(u.registered_at).getTime()/1000,
                    user_hash: sha256.hmac(Config.intercom.hash, u.email)
                }
                var ic = w.Intercom;
                if (typeof ic === "function") {
                    ic('reattach_activator');
                    ic('update', intercomSettings);
                } else {
                    var d = document;
                    var i = function() {
                        i.c(arguments)
                    };
                    i.q = [];
                    i.c = function(args) {
                        i.q.push(args)
                    };
                    w.Intercom = i;

                    function l() {
                        var s = d.createElement('script');
                        s.type = 'text/javascript';
                        s.async = true;
                        s.src = 'https://widget.intercom.io/widget/a7rzvk6i';
                        var x = d.getElementsByTagName('script')[0];
                        x.parentNode.insertBefore(s, x);
                    }
                    if (w.attachEvent) {
                        w.attachEvent('onload', l);
                    } else {
                        w.addEventListener('load', l, false);
                    }
                }
            })(user)
        } catch (e) {
            console.error('Could not display Intercom component', e);
        }
    }

    render() {
        return <span />
    }
}
