import React from 'react'
import { Button } from 'react-toolbox'
import defer from 'lodash/defer'

import History from '../../history'
import Config from '../../config'
import Styles from './styles'

class LinkActions extends React.PureComponent {

    render() {
        const { failureCode, link, tokenError } = this.props.item
        let ActionsComponent = () => failureCode ? (
            <div>
                <Button flat accent label='Delete' onClick={this.del} />
                {tokenError ? <Button flat accent label="Reconnect" onClick={evt => History.push(Config.routes.manageAccounts)} /> : <span />}
                {!tokenError ? <Button flat accent label="Reschedule" onClick={this.props.editScheduledLink(this.props.item)} /> : <span />}
            </div>
        ) : (
            <div>
                <Button flat primary label='Delete' onClick={this.del} />
                <Button flat primary label='Edit' onClick={this.props.editScheduledLink()} />
            </div>
        )

        return (
            <footer className={Styles.callToActions}>
                <section className={Styles.articleActions}>
                    <ActionsComponent />
                </section>
            </footer>
        )
    }

    del = event => {
        this.props.deleteScheduledLink()(event);
        setTimeout(this.props.onDeleteCall, 100);
    }
}

export default LinkActions
