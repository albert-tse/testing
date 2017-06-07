import React from 'react';
import Container from 'alt-container';
import { compose, pure } from 'recompose';

import SideQueueComponent from './SideQueue.component';

function SideQueueContainer(props) {
    return (
        <Container
            component={composed(SideQueueComponent)}
            transform={transform}
            {...props}
        />
    )
}

function transform(props) {
    return props;
}

function composed(component) {
    return compose(
        pure
    )(component);
}

export default SideQueueContainer;
