/**
 * The model used to acces DPLA data.
 * 
 * @class DPLAModel
 */
DPLAModel = Backbone.Model.extend({
	
	fetching_data: false,
	
	initialize: function(options)  {
		this.fetching_data = false;
		this.getDplaData(new SearchTerm("cats"));
	},
	runSearch: function(evt, formId)  {
		var obj_data = {};
		$.each($(formId).serializeArray(), function() {
		    if(this.name != 'submit' && this.name != 'cancel')  {
		    	obj_data[this.name] = this.value;
		    }
		});
		//console.log(JSON.stringify(obj_data, null, 1));
		var search_term = obj_data.search_term_any;
		delete obj_data.search_term_any;
		
		this.getDplaData(new SearchTerm(search_term, null, obj_data));
	},
	resetSearch: function()  {
		$('#advanced-search-form')[0].reset();
	},
	loadMoreContent: function()  {
		if(!this.fetching_data)  {
			this.fetching_data = true;
			var self = this;
			Meteor.call( 'load_more_dpla_data', function( err, res ) { self.onUpdateDataReturned(err, res); });
		}
	},
	getDplaData: function(search_data)  {
		if(!this.fetching_data)  {
			this.fetching_data = true;
			var self = this;
			Meteor.call( 'get_dpla_data', search_data, function( err, res ) { self.onDataReturned(err, res); });
		}
	},
	onDataReturned: function(err, res)  {
		this.fetching_data = false;
		//console.log("data: " + JSON.stringify(res, 2, null));
        if(!err)  {
        	var data_obj = new Array();
        	this.parseSearchData(data_obj, res);
        	
        	Session.set('datasets', data_obj);
        	//Session.set('datasets', Utils.parseObject(res));
        } else  {
        	console.log(err);
        }
	},
	onUpdateDataReturned: function(err, res)  {
		this.fetching_data = false;
        if(!err)  {
        	var data_obj = Session.get('datasets') || new Array();
        	if(res.docs != undefined)  {
        		this.parseSearchData(data_obj, res);
        	}
        	Session.set('datasets', data_obj);
        } else  {
        	console.log(err);
        }
	},
	parseSearchData: function(data_array, results)  {
		for(var i = 0; i < results.docs.length; i++)  {
    		var doc = results.docs[i];
    		var obj = {
        		title: doc["sourceResource.title"],
        		author: doc["sourceResource.creator"] || "None listed",
        		description: doc["sourceResource.description"],
        		isShownAt: doc["isShownAt"],
        		dataProvider: doc["dataProvider"],
        		type: doc["sourceResource.type"],
        		date: (doc["sourceResource.date"] && doc["sourceResource.date"].displayDate) ? doc["sourceResource.date"].displayDate: 'None listed'
        	};
        	switch(obj.type)  {
        		case "image":
        			obj.object = '<a href="' + doc["isShownAt"] + '" target="_blank"><img src="' + doc["object"] + '" /></a>';
        			break;
        		case "text":
        			obj.object = '<a href="' + doc["isShownAt"] + '" target="_blank"><img src="./images/document_icon.png" /></a>';
        			break;
        		case "moving image":
        			obj.object = '<a href="' + doc["isShownAt"] + '" target="_blank"><img src="./images/video_icon.jpg" /></a>';
        			break;
        		case "sound":
        			obj.object = '<a href="' + doc["isShownAt"] + '" target="_blank"><img src="./images/sound_icon.jpg" /></a>';
        			break;
        		default:
        			obj.object = '<a href="' + doc["isShownAt"] + '" target="_blank"><img src="./images/object_icon.png" /></a>';
        	}
        	data_array.push(obj);
    	}
	}
});