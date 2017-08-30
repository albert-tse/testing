import React from 'react'
import classnames from 'classnames'
import {
    branch,
    compose,
    withProps
} from 'recompose'

import withPopover from '../../hoc/withPopover'
import ReconnectButton from './ReconnectButton.component'
import RescheduleButton from './RescheduleButton.component'
import LinkActions from './LinkActions.component'
import Styles from './styles'

class ScheduledPostMini extends React.Component {
    render() {
        const {
            CallToAction,
            isArticleModalOpen,
            isShareDialogOpen,
            editScheduledLink,
            item
        } = this.props;

        const bgUrl = this.props.selectedProfile ? this.props.selectedProfile.profile_picture : false;
        const isDimmed = isArticleModalOpen || isShareDialogOpen;
        const className = classnames(
            Styles.queueItemMini,
            Styles.scheduledMini,
            isDimmed && Styles.dimmed,
            !!item.failureCode && Styles.failed
        );

        return (
            <div
                className={className}
                style={{backgroundImage: `url(${item.attachmentImage})` }}
                onClick={editScheduledLink(item)}
            >
                <div className={Styles.fade}>
                    <div className={classnames(Styles.time, !bgUrl && Styles.noAvatar)}>
                        {bgUrl && <div className={Styles.influencerImage} style={{backgroundImage: `url(${bgUrl})` }}></div>}
                        <div>{item.time.format('h:mma (z)')}</div>
                    </div>
                    {typeof CallToAction !== 'undefined' && <CallToAction />}
                </div>
            </div>
        );
    }

}

/**
 * This would specify which call to action button to show if this is a fialed post
 * @param {boolean} isFailedPost determines whether we should add a new prop for CTA button or not
 * @return {React.Component} A higher-order component that would inject CTA button if is a failed post
 */
const getCallToActionForFailedPost = isFailedPost => (
    branch(
        isFailedPost,
        withProps(props => ({
            CallToAction: props.item.tokenError > 0
                ? ReconnectButton
                : RescheduleButton
        }))
    )
)

/**
 * The component that will be shown when user hovers over the component
 * @param {object} props contains information regarding the scheduled post
 * @return {JSX}
 */
const PopoverComponent = props => {
    const { item } = props

    return (
        <div className={Styles.popover}>
            <p className={Styles.message}>{item.message}</p>
            <div className={Styles.meta}>
                <div className={Styles.thumbnail} style={{ backgroundImage: `url("${item.attachmentImage}")` }} />
                <div>
                    <p className={Styles.headline}>{item.attachmentTitle}</p>
                </div>
            </div>
            {!item.postedTime && <LinkActions {...props} />}
        </div>
    )
}

export default compose(
    getCallToActionForFailedPost(props => props.item.failureCode > 0),
    withPopover({
        popoverComponent: PopoverComponent,
        attachment: 'top right',
        targetAttachment: 'top left',
        renderElementTo: 'body'
    })
)(ScheduledPostMini)
