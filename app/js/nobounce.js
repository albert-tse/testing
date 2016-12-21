(function (global) {

    let lastTouchCoords = {
        x: 0,
        y: 0
    };

    /**
     * Begin tracking user's touches
     * @param {Event} evt is not used
     */
    const init = evt => {
        window.addEventListener('touchstart', recordTouchCoords, false);
        window.addEventListener('touchmove', checkIfShouldScroll, false);
    };

    /**
     * Record the initial coordinates of the user's finger so we can determine
     * at the next move, whether user is panning top/right/bottom/left
     * @param {Event} evt contains touch coordinates
     */
    const recordTouchCoords = evt => {
        getTouchCoords(touchCoords => {
            lastTouchCoords = touchCoords;
        }, evt);
    };

    /**
     * Prevents the user from scrolling the entire app
     * @param {Event} evt contains coordinates of where user's finger
     */
    const checkIfShouldScroll = evt => {
        getTouchCoords(touchCoords => {
            const dX = lastTouchCoords.x - touchCoords.x;
            const dY = lastTouchCoords.y - touchCoords.y;

            // panning vertically or horizontally
            if (Math.abs(dY) > Math.abs(dX)) { // panning vertically
                const isPanningUp = dY < 0;
                let el = evt.target;

                while (el !== document.body) {
                    const style = window.getComputedStyle(el);

                    if (!!!style) {
                        break; // Element has no style property so stop checking
                    }

                    // If Element is a slider, bypass check
                    if (el.nodeName === 'INPUT' && el.getAttribute('type') === 'range') {
                        return;
                    }


                    const scrolling = style.getPropertyValue('-webkit-overflow-scrolling');
                    const overflowY = style.getPropertyValue('overflow-y');
                    const height = parseInt(style.getPropertyValue('height'), 10);

                    // Determine if the element should scroll
                    const isScrollable = scrolling === 'touch' && (overflowY === 'auto' || overflowY === 'scroll');
                    const canScroll = el.scrollHeight > el.offsetHeight;

                    if (isScrollable && canScroll) {
                        const isScrollingUp = dY < 0;

                        // Determine if the user is trying to scroll past the top or bottom
                        // In this case, the window will bounce, so we have to prevent scrolling completely
                        const isAtTop = (isScrollingUp && el.scrollTop === 0);
                        const isAtBottom = (!isScrollingUp && el.scrollHeight - el.scrollTop === height);

                        // Stop a bounce bug when at the bottom or top of the scrollable element
                        if (isAtTop || isAtBottom) {
                            evt.preventDefault();
                        }

                        // No need to continue up the DOM, we've done our job
                        return;
                    }

                    el = el.parentNode;
                } // end loop

                evt.preventDefault(); // We've reached the body, stop any scrolling
            } // end panning vertically

            lastTouchCoords = touchCoords;
        }, evt);
    };

    /**
     * Wrap callback functions that can only run on touch-capable devices
     * Executes the callback function, passing the touch coordinates from the event
     * @param {Function} func callback function that accepts an Event as args
     * @param {Event} evt that was passed to the callback method
     * @return {Functor}
     */
    const getTouchCoords = (func, evt) => {
        try {
            if (evt.touches.constructor.name === 'TouchList') {
                const touchList = evt.touches[0];
                func({
                    x: touchList.screenX,
                    y: touchList.screenY
                });
            }
        } catch (e) { // This is not a touch-capable device
            return false;
        }
    };


    // Run only when DOM is loaded
    window.addEventListener('load', init, false);
})(global);
