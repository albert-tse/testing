import React from 'react';
import { IconButton } from '../../index';

import { headlineTooltip } from './styles';

export default class HeadlineIssue extends React.PureComponent {

    render() {
        return (
            <IconButton
                className={headlineTooltip}
                icon="warning"
                title="This title may not follow our content guidelines. Consider rewriting before sharing."
            />
        );
    }
}

