import React from 'react';
import Container from 'alt-container';
import { pure } from 'recompose';

import Config from '../../config';

function SideQueueContainer({ component, ...props }) {
    return (
        <Container
            component={pure(component)}
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

export default SideQueueContainer;
