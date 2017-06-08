import React from 'react';
import Container from 'alt-container';
import { compose, pure } from 'recompose';


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
        pure
    )(component);
}

function componentDidMount(prev, next) {
    return console.log('component mounted', prev, next);
}

export default SideQueueContainer;
