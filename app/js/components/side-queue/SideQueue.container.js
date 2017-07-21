import React from 'react';
import Container from 'alt-container';

import Config from '../../config';

function SideQueueContainer({ component, ...props }) {
    return (
        <Container
            component={component}
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
