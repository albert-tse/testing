import React from 'react'
import { Button } from 'react-toolbox'

import Styles from './styles';

class RescheduleButton extends React.PureComponent {
    render() {
        return (
            <Button
                className={Styles.reconnectButton}
                label="Reschedule"
                onClick={evt => {}}
            />
        )
    }
}

export default RescheduleButton
