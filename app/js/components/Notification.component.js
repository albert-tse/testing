import React from 'react';
import { Button, IconButton } from 'react-toolbox';
import { map } from 'lodash';
import classnames from 'classnames';

import NotificationActions from '../actions/Notification.action';

import Styles from './app/style.theme.snackbar'

export default class Notification extends React.PureComponent {
    render() {
        const {
            buttons,
            error,
            label
        } = this.props

        return (
            <span className={classnames(Styles.injectedButtonHolder, error && Styles.error)}>
                <span className={Styles.injectedLabel}>{label}</span>
                <div>
                    {map(buttons, (buttonProps, index) => (
                        <NotificationButton
                            key={index}
                            error={error}
                            {...buttonProps}
                        />
                    ))}
                </div>
            </span>
        )
    }
}

class NotificationButton extends React.PureComponent {
    render() {
        const {
            error,
            label,
            onClick,
            className
        } = this.props

        return (
            <Button
                className={classnames(Styles.injectedButton, error && Styles.error, className)}
                label={label}
                onClick={evt => {
                    var dismiss = true;
                    if(onClick){
                        dismiss = !(onClick() === false);
                    }
                    if(dismiss){
                        NotificationActions.dismiss();
                    }
                }}
            />
        )
    }
}
