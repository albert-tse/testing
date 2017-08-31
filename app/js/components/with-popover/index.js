import React from 'react'
import PropTypes from 'prop-types'
import TetherComponent from 'react-tether'
import find from 'lodash/find'
import {
    compose,
    setDisplayName,
    wrapDisplayName,
    withStateHandlers,
    withHandlers
} from 'recompose'

class WithPopover extends React.Component {
    render() {
        const ContentChild = find(this.props.children, child => child.type.name === 'Content')
        let PopoverChild = find(this.props.children, child => child.type.name === 'Popover')

        if (ContentChild && PopoverChild) {
            return (
                <TetherComponent
                    attachment={this.props.attachment}
                    targetAttachment={this.props.targetAttachment}
                    renderElementTo={this.props.renderElementTo}
                    offset={this.props.offset}
                >
                    <div
                        onMouseEnter={this.props.togglePopover(true)}
                        onMouseLeave={this.props.togglePopover(false)}
                    >
                        {ContentChild}
                    </div>
                    {this.props.isPopoverActive && (
                        <div
                            onMouseEnter={this.props.showPopover}
                            onMouseLeave={this.props.togglePopover(false)}
                        >
                            {PopoverChild}
                        </div>
                    )}
                </TetherComponent>
            )
        } else {
            console.debug('WithPopover component did not receive children of Content/Popover types')
            return (
                <div>{this.props.children}</div>
            )
        }
    }
}

export class Popover extends React.Component {
    render() {
        return <div>{this.props.children}</div>
    }
}

export class Content extends React.Component {
    render() {
        return <div>{this.props.children}</div>
    }
}

/** @constant
    @type {number}
    The number of milliseconds to wait between a user hovering over
    the base component and popover showing
*/
const POPOVER_DELAY = 1000

/**
 * Updates the HOC state so that the popover is shown
 * @param {object} props component properties and state
 * @param {object<Event>} evt contains the mouseenter event that called this function
 * @return {object} updated state
 */
const showPopover = props => evt => {
    clearTimeout(props.timeoutId)
    return {
        isPopoverActive: true,
        timeoutId: null
    }
}

/**
 * Resets the HOC state and cancel the delayed call to show popover (if applicable)
 * @param {object} props component properties and state
 * @param {object<Event>} evt contains the mouseleave event that called this function
 * @return {object} updated state
 */
const hidePopover = props => evt => {
    clearTimeout(props.timeoutId)
    return {
        isPopoverActive: false,
        timeoutId: null
    }
}

/**
 * Updates the HOC with a timeout id generated when creating a delayed
 * function call to show popover
 * @param {object} props component properties and state
 * @param {number} timeoutId id returned by calling setTimeout()
 * @return {object} updated state with timeout id
 */
const setTimeoutId = props => timeoutId => ({
    timeoutId
})

/**
 * A function that is called when the user hovers over the base component
 * It will set a delayed call to show popover and update the HOC's state accordingly
 * @param {object} props contains component properties and state
 * @param {object<Event>} evt Event that is dispatched when user hovers over the base component
 */
const togglePopover = ({
    hidePopover,
    setTimeoutId,
    showPopover,
    timeoutId,
    popoverDelay = POPOVER_DELAY
}) => toggleOn => evt => {
    clearTimeout(timeoutId)
    setTimeoutId(setTimeout(() => {
        toggleOn ? showPopover(evt) : hidePopover(evt)
    }, popoverDelay))
}

export default compose(
    withStateHandlers({
        timeoutId: null,
        isPopoverActive: false
    }, {
        setTimeoutId,
        showPopover,
        hidePopover
    }),
    withHandlers({
        togglePopover
    })
)(WithPopover)
