var Future = Meteor.require('fibers/future');
/**
 * The main server file, general server side code should go here.
 * 
 * @namespace Server
 */
Server = {
	/**
	 * API key for dp.la.
	 * 
	 * @memberof Server
	 * @instance
	 * @type {String}
	 */
	API_KEY: 'e9e8d97c153f54ddf710f2ad802ee808',
	/**
	 * Start the application.
	 * 
	 * @function
	 * @memberof Server
	 * @instance
	 */
	startup: function()  {
		// Code to run on server at startup.
	},
	/**
	 * Update data after method call.
	 * 
	 * @function
	 * @memberof Server
	 * @instance
	 */
	update_data: function(reddit_name, result, future)  {
		
		var stories = result.data.data.children.map(function(story)  { return story.data; });
		var insert_array = new Array();
		for(var i = 0; i < stories.length; i++)  {
			var story = stories[i];
			//console.log("story.title: "+story.title);
			insert_array.push({
				order: i,
				domain: story.domain,
				title: story.title,
				url: story.url,
				thumbnail: story.thumbnail,
				permalink: story.permalink,
				num_comments: story.num_comments,
				author: story.author,
				subreddit: story.subreddit,
				score: story.score,
				over_18: story.over_18,
				created_utc: story.created_utc
			});
		}

		Reddits.upsert({ _id: reddit_name }, { $set: { stories: insert_array, last_update: Date.now() } }, function(e, r)  {
			if(e)  {
				future.throw(e);
			} else  {
				future.return(insert_array);
			}
			
		});
	}
};
Meteor.startup(function (err, res) {
	Server.startup();
});
/**
 * 
 */
Meteor.methods({
    get_dpla_data: function(search_data) {
    	var count = 10,
    		limit,
    		search_term;
    	switch(search_data.search_item_type)  {
    		case "text":
    			limit = 'sourceResource.type=text';
    			break;
    		case "image":
    			limit = 'sourceResource.type=image';
    			break;
    		case "sound":
    			limit = 'sourceResource.type=sound';
    			break;
    		case "video":
    			limit = 'sourceResource.type="moving image"';
    			break;
    		default:
    			limit = '';
    	}
    	
		var punctuationless = search_data.search_term.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
		search_data.search_term = punctuationless.replace(/\s{2,}/g," ");
    	search_term = (search_data.search_term_join === 'or') ? search_data.search_term.split(' ').join('+OR+'): search_data.search_term.split(' ').join('+AND+');
        
        var future = new Future(), 
        	url = 'http://api.dp.la/v2/items?' + limit + '&q=' + search_term + '&page_size=' + count + '&api_key=' + Server.API_KEY;
        	
        // Do call here, return value with Future.
        Meteor.http.get(url, function( err, res ){
        	if(err)  {
        		future.throw(err);
        	} else  {
        		future.return(JSON.parse(res.content));
        	}
        });
        // Force method to wait on Future return.
        return future.wait();
    }
});
/**
 * Set permissions on the users collection.
 * 
 * @memberof Meteor.users
 * @private
 */
Meteor.users.allow({
	// A user can update their own record.
	update: function(userId, doc)  {
		return userId == this.userId;
	}
});