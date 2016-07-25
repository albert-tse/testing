import React from 'react';
import AltContainer from 'alt-container';
import SignUpStore from '../../stores/SignUp.store';

export default class SubmitComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                store={SignUpStore}
                component='button'
                transform={props => ({
                    id: 'submitButton',
                    type: 'submit',
                    className: 'btn btn-primary',
                    children: 'Agree and Submit'
                })}
            />
        );
    }
}
