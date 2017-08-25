import React from 'react'
import { Button } from 'react-toolbox'

import Styles from './styles'

class LinkActions extends React.PureComponent {

    render() {
        return (
            <footer className={Styles.callToActions}>
                <section className={Styles.articleActions}>
                    <Button primary label='Delete' onClick={this.del} flat />
                    <Button primary label='Edit' onClick={this.props.editScheduledLink()} flat />
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
