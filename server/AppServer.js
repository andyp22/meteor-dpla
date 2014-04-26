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
    	
    	// Do call here, return value with Future.
        Meteor.http.get(Server.query_generator.getQuery(search_data), function( err, res ){
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