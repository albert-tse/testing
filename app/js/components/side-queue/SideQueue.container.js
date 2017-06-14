import React from 'react';
import Container from 'alt-container';
import { compose, pure, withHandlers } from 'recompose';

import Config from '../../config';

function SideQueueContainer({ component, ...props }) {
    return (
        <Container
            component={composed(component)}
            transform={transform}
            {...props}
        />
    )
}

function transform({
    ProfileSelectorStore
}) {
    return {
        isProfileSelected: ProfileSelectorStore.selectedProfile && ProfileSelectorStore.selectedProfile.id > -1
    };
}

function composed(component) {
    return compose(
        withHandlers({
            goToManageAccounts: goToManageAccountsHandler
        }),
        pure
    )(component);
}

function goToManageAccountsHandler(props) {
    return function goToManageAccountsFactory() {
        return function goToManageAccountsCallback(evt) {
            window.open('/#' + Config.routes.manageAccounts);
            evt.stopPropagation();
        }
    }
}

function componentDidMount(prev, next) {
    return console.log('component mounted', prev, next);
}

export default SideQueueContainer;
