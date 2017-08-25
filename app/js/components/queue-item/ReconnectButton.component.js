import React from 'react'
import { Button } from 'react-toolbox'

import History from '../../history'
import Styles from './styles';

class ReconnectButton extends React.PureComponent {
    render() {
        return (
            <Button
                className={Styles.reconnectButton}
                label="Reconnect"
                onClick={evt => {
                    History.push(Config.routes.manageAccounts)
                    evt.stopPropagation()
                }}
            />
        )
    }
}

export default ReconnectButton
