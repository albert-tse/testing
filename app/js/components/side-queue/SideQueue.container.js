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
    ArticleStore,
    ProfileSelectorStore,
    ShareDialogStore
}) {
    return {
        isArticleModalOpen: ArticleStore.viewing,
        isProfileSelected: ProfileSelectorStore.selectedProfile && ProfileSelectorStore.selectedProfile.id > -1,
        isShareDialogOpen: ShareDialogStore.isActive
    };
}

export default SideQueueContainer;
