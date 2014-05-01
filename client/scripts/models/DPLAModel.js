/**
 * The model used to acces DPLA data.
 * 
 * @class DPLAModel
 */
DPLAModel = Backbone.Model.extend({
	
	initialize: function(options)  {
		this.getDplaData(new SearchTerm("cats"));
	},
	runSearch: function(evt, formId)  {
		var obj_data = {};
		$.each($(formId).serializeArray(), function() {
		    if(this.name != 'submit' && this.name != 'cancel')  {
		    	obj_data[this.name] = this.value;
		    }
		});
		console.log(JSON.stringify(obj_data, null, 1));
		var search_term = obj_data.search_term_any;
		delete obj_data.search_term_any;
		
		this.getDplaData(new SearchTerm(search_term, null, obj_data));
	},
	getDplaData: function(search_data)  {
		var self = this;
		Meteor.call( 'get_dpla_data', search_data, function( err, res ) { self.onDataReturned(err, res); });
	},
	onDataReturned: function(err, res)  {
		//console.log("data: " + JSON.stringify(res, 2, null));
        if(!err)  {
        	var data_obj = new Array();
        	for(var i = 0; i < res.docs.length; i++)  {
        		var doc = res.docs[i];
        		//console.log("author: " + doc.sourceResource.creator);
        		var obj = {
	        		title: doc.sourceResource.title,
	        		author: doc.sourceResource.creator || "None listed",
	        		description: doc.sourceResource.description,
	        		isShownAt: doc.isShownAt,
	        		dataProvider: doc.dataProvider,
	        		type: doc.sourceResource.type,
	        		date: (doc.sourceResource.date && doc.sourceResource.date.displayDate) ? doc.sourceResource.date.displayDate: 'None listed'
	        	};
	        	switch(obj.type)  {
	        		case "image":
	        			obj.object = '<a href="' + doc.isShownAt + '" target="_blank"><img src="' + doc.object + '" /></a>';
	        			break;
	        		default:
	        			obj.object = '<a href="' + doc.isShownAt + '" target="_blank">Source</a>';
	        		
	        	}
	        	data_obj.push(obj);
        	}
        	
        	Session.set('datasets', data_obj);
        	//Session.set('datasets', Utils.parseObject(res));
        } else  {
        	console.log(err);
        }
	}
});