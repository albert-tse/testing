import React from 'react';
import { Button } from 'react-toolbox';
import AltContainer from 'alt-container';

export default class SubmitComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { disabled } = this.props;

        return (
            <AltContainer
                component={Button}
                transform={props => ({
                    id: 'submitButton',
                    type: 'submit',
                    className: 'btn btn-primary',
                    children: 'Agree and Submit',
                    raised: true,
                    accent: true,
                    disabled
                })}
            />
        );
    }
}
