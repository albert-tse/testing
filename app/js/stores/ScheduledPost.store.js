import alt from '../alt';
import ScheduledPostActions from '../actions/ScheduledPost.action';
import ScheduledPostSource from '../sources/ScheduledPost.source';

var BaseState = {};

class ScheduledPostStore {
    constructor() {
        Object.assign(this, BaseState);

        this.registerAsync(ScheduledPostSource);
        this.bindActions(ScheduledPostActions);
        this.exportPublicMethods({});
    }

    onGotScheduledPosts(posts) {

    	console.log('got posts', posts);

    	let fakePosts = [
    		{
		      "id": 306,
		      "userId": 195,
		      "influencerId": 528,
		      "platformId": 2,
		      "profileId": 363,
		      "linkId": 242424,
		      "scheduledTime": "2017-05-10 21:00:55",
		      "postedTime": "2017-05-10 21:01:32",
		      "message": "asdf",
		      "attachmentTitle": "asdlfkj",
		      "attachmentCaption": "Pink News",
		      "attachmentDescription": "asdflj",
		      "attachmentImage": "https://tse-media.s3.amazonaws.com/img/994654"
		    },
		    {
		      "id": 305,
		      "userId": 195,
		      "influencerId": 528,
		      "platformId": 2,
		      "profileId": 363,
		      "linkId": 242423,
		      "scheduledTime": "2017-05-10 21:19:55",
		      "postedTime": "2017-05-10 21:20:30",
		      "message": "the science guyanese",
		      "attachmentTitle": "It's amazing",
		      "attachmentCaption": "knowable.com",
		      "attachmentDescription": "heartbreak",
		      "attachmentImage": "https://tse-media.s3.amazonaws.com/img/998606"
		    },
		    {
		      "id": 304,
		      "userId": 195,
		      "influencerId": 528,
		      "platformId": 2,
		      "profileId": 363,
		      "linkId": 242422,
		      "scheduledTime": "2017-05-10 18:45:46",
		      "postedTime": "2017-05-10 18:46:30",
		      "message": "afas",
		      "attachmentTitle": "This amazing tweet about coming out proves mothers are always right",
		      "attachmentCaption": "Pink News",
		      "attachmentDescription": "Talk about a suspenseful hiatus - a lesbian has possibly proven that mums are always right, but definitely, that suspense works. In a huge plot twist, a 20-year-old took a four-year break to come out as gay, after denying to her mum that she was a lesbian.",
		      "attachmentImage": "https://tse-media.s3.amazonaws.com/img/994654"
		    }
    	];

    	// TODO: we need the shortlink associated with this scheduled post
    	// TODO: we might need article info associated with the post, for edit purposes

    	this.setState({
            posts: fakePosts
        });
    }
}

export default alt.createStore(ScheduledPostStore, 'ScheduledPostStore');
