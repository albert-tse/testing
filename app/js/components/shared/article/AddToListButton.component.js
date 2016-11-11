import React, { Component, PropTypes } from 'react';
import { Button, IconButton } from 'react-toolbox';

import Styles from './styles.action-buttons';

export default class AddToListButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const props = {
            icon: 'playlist_add',
            label: 'Add to List'

        };

        return (
            <div>
                <Button className={Styles.normal} {...props} />
                <IconButton className={Styles.icon} {...props} />
            </div>
        );
    }
}
