import React from 'react';
import { Button } from 'react-toolbox';
import classnames from 'classnames';

import Queue from '../queue';
import { CTAToAddProfiles } from '../null-states';
import Styles from './styles';

function SideQueueComponent({
    isArticleModalOpen,
    isProfileSelected,
    isShareDialogOpen
}) {
    return (
        <div className={classnames(Styles.container, !isProfileSelected && Styles.centered)}>
            {isProfileSelected ? (
                <Queue
                    isArticleModalOpen={isArticleModalOpen}
                    isShareDialogOpen={isShareDialogOpen}
                    mini
                />
            ) : <CTAToAddProfiles />}
        </div>
    );
}


export default SideQueueComponent;
