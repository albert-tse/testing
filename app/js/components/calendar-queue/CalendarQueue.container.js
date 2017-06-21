import React from 'react';
import Container from 'alt-container';

function CalendarQueueContainer(props) {
    return (
        <Container
            transform={transform}
            {...props}
        />
    )
}

function transform({ ProfileSelectorStore }) {
    return {
        isEnabled: ProfileSelectorStore.hasConnectedProfiles(),
        selectedProfile: ProfileSelectorStore.selectedProfile
    };
}

export default CalendarQueueContainer;
