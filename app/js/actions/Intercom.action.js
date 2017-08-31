class IntercomActions {

    trackEvent(eventName, payload = {}) {
        if (SHOW_INTERCOM) {
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
