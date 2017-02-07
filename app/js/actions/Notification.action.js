class NotificationActions {

    //showANewNotification
    add(notificationData) {
        this.dispatch(notificationData);
    }

    //Dismiss a notification
    dismiss(notificationData) {
        this.dispatch(notificationData);
    }

    // Handles the click event on the action button (default: DISMISS)
    onClick() {
        this.dispatch();
    }

}

const Actions = alt.createActions(NotificationActions);

export default Actions;

//For actions we will perform our imports last. If we do this first it tends to create dependency loops. 
import alt from '../alt';

const staticNotifs = [
    {
        label: `"Never forget what you are, for surely the world will not. Make it your strength. Then it can never be your weakness. Armour yourself in it, and it will never be used to hurt you." \n - Tyrion Lannister, A Game of Thrones`
    },{
        label:`"It is often said that before you die your life passes before your eyes. This is in fact true. It's called living." - Terry Pratchett`
    },{
        label:`"A reader lives a thousand lives before he dies. The man who never reads lives only one." - George R. R. Martin, A Storm of Swords (Jojen Reed)`
    },{
        label:`“It's the questions we can't answer that teach us the most. They teach us how to think. If you give a man an answer, all he gains is a little fact. But give him a question and he'll look for his own answers.” - Patrick Rothfuss, The Wise Man's Fear`
    },{
        label:`"Love is that condition in which the happiness of another person is essential to your own." - Robert A. Heinlein, Stranger in a Strange Land`
    },{
        label:`“We love what we love. Reason does not enter into it. In many ways, unwise love is the truest love. Anyone can love a thing because. That's as easy as putting a penny in your pocket. But to love something despite. To know the flaws and love them too. That is rare and pure and perfect.” - Patrick Rothfuss, The Wise Man's Fear`
    },{
        label:`“History is a wheel, for the nature of man is fundamentally unchanging. What has happened before will perforce happen again.” ― George R.R. Martin, A Feast for Crows`
    },{
        label:`“Why do you go away? So that you can come back. So that you can see the place you came from with new eyes and extra colors. And the people there see you differently, too. Coming back to where you started is not the same as never leaving.” ― Terry Pratchett, A Hat Full of Sky`
    },{
        label:`“The purpose of a storyteller is not to tell you how to think, but to give you questions to think upon.” ― Brandon Sanderson, The Way of Kings`
    },{
        label:`"It is our choices that show who we truly are, far more than our abilities." - Albus Dumbledore, Harry Potter `
    },{
        label:`"Words can light fires in the minds of men. Words can wring tears from the hardest hearts." - Patrick Rothfuss, The Name of the Wind`
    },{
        label:`“The trouble with having an open mind, of course, is that people will insist on coming along and trying to put things in it.” ― Terry Pratchett, Diggers`
    },{
        label:`"You should never ask an engineer to explain a thing. Because they will!"`
    },{
        label:`"At what point did we forget that the Space Shuttle was, essentially, a program that strapped human beings to an explosion and tried to stab through the sky with fire and math?"`
    }
]

$(document).keypress(function(e){
    if( e.which == 14 && e.shiftKey && e.ctrlKey ){
        var props = {
            onTimeout: Actions.dismiss,
            timeout: 0,
            action: 'ok',
            type: 'accept'
        };

        props.label = staticNotifs[Math.round(Math.random()*(staticNotifs.length - 1))].label;

        Actions.add( props );
    }
});