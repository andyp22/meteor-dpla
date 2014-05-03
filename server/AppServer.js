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
		this.query_generator = new QueryGenerator('http://api.dp.la', 'v2', this.API_KEY);
	},
	runDplaQuery: function(query_url, future)  {
		// Do call here, return value with Future.
        Meteor.http.get(query_url, function( err, res ){
        	if(err)  {
        		future.throw(err);
        	} else  {
        		var data_obj = JSON.parse(res.content);
        		
        		if(Server.query_generator.getCount() > data_obj.docs.length)  {
        			Server.query_generator.disableUpdates();
        		}
        		
        		future.return(data_obj);
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
    	var future = new Future();
    	Server.runDplaQuery(Server.query_generator.getQuery(search_data), future);
    	return future.wait();
    },
    load_more_dpla_data: function() {
    	var future = new Future();
    	if(Server.query_generator.queriesEnabled())  {
    		Server.runDplaQuery(Server.query_generator.buildQuery(), future);
    		return future.wait();
    	} else  {
    		// No more results!!
    		future.return(new Object());
    	}
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