/**
 * A Higher-Order Component for components that want to show a
 * popover component on hover
 *
 * @return {function}
 */
import React from 'react'
import TetherComponent from 'react-tether'
import {
    compose,
    createEagerFactory,
    setDisplayName,
    wrapDisplayName,
    withStateHandlers,
    withHandlers
} from 'recompose'

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

/**
 * A higher-order component that adds
 * state to the base component and shows/hides a popover component whenever
 * the user hovers over the base component
 * @param {function<React.Component|React.PureComponent>} BaseComponent that is going to have a popover shown on hover
 * @param {object} options can modify the default options of the popover-wrapped component such as delay time
 * @return {function}
 */
const withPopoverState = (BaseComponent, options = {}) => {
    const factory = createEagerFactory(BaseComponent)
    class WithPopoverState extends React.Component {
        render() {
            return (
                <TetherComponent
                    attachment={options.attachment}
                    targetAttachment={options.targetAttachment}
                    renderElementTo={options.renderElementTo}
                >
                    <div
                        className="WithPopoverState"
                        onMouseEnter={this.props.togglePopover(true)}
                        onMouseLeave={this.props.togglePopover(false)}
                    >
                        {factory(this.props)}
                    </div>
                    {this.props.isPopoverActive && typeof options.popoverComponent === 'function' && (
                        <div
                            onMouseEnter={this.props.showPopover}
                            onMouseLeave={this.props.togglePopover(false)}
                        >
                            <options.popoverComponent {...this.props } />
                        </div>
                    )}
                </TetherComponent>
            )
        }
    }

    return compose(
        setDisplayName(wrapDisplayName(BaseComponent, 'withPopover')),
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
    )(WithPopoverState)
}

/**
 * A function that wraps around the HOC so that it's not required to pass options
 * Usage:
 *
 * use default options
 * withPopover(BASE_COMPONENT)
 *
 * override default options
 * withPopover({ delay: 2000 })(BASE_COMPONENT)
 *
 * @param {object|object<React.Component|React.PureComponent>} BaseComponent or might be the options object
 * @return {object<React.Component|React.PureComponent>} component with popover included
 */
const withPopover = BaseComponent => (
    typeof BaseComponent === 'function'
        ? withPopoverState(BaseComponent)
        : Component => withPopoverState(Component, BaseComponent)
)

export default withPopover
