import React from 'react'

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
