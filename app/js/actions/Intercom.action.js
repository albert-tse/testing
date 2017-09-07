import Config from '../config'

class IntercomActions {

    trackEvent(eventName, payload = {}) {
        if (Config.intercom.show) {
            try {
                window.Intercom('trackEvent', eventName, payload)
            } catch (e) {
                console.error('Could not notify Intercom', e)
            }
        }
    }

    scheduledPost(payload) {
        this.trackEvent('scheduledPost', {
            postId: payload.postId
        })
    }

}

export default new IntercomActions()
