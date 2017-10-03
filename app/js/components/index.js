import React from 'react'
import {
    Button as RTButton,
    IconButton as RTIconButton
} from 'react-toolbox'

import styles from './styles'

export class View extends React.PureComponent {
    render() {
        const { children, ...attributes } = this.props

        return (
            <div {...attributes}>
                {children}
            </div>
        )
    }
}

export class Button extends React.Component {
    render() {
        return (
            <RTButton
                theme={styles}
                ripple={false}
                {...this.props}
            />
        )
    }
}

export class IconButton extends React.Component {
    render() {
        return (
            <RTIconButton
                theme={styles}
                ripple={false}
                {...this.props}
            />
        )
    }
}
