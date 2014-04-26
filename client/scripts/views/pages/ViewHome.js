/*
 * View logic for the home page.
 */
ViewHome = Backbone.View.extend({
	
	template: null,
	
	initialize: function()  {
		var self = this;
		Template.home.events = {
			// Prevent the page reloading for links.
			"click a.internal": function(e)  {
				App.router.clickReplace(e);
			}
		};
		
		Template.search_form.events = {
			// Prevent the page reloading for links.
			"submit": function(e) {
           		e.preventDefault();
           		self.runSearch(e);
			}
		};
		
		var test_data = {
			"search_term": "meteor bone",
			"search_term_join": "or",
			"search_item_type": "all"
		};
		
		this.getDplaData(test_data);
	    
	    Template.home.datasets = function(e)  {
			return Session.get('datasets');
		};
		
		this.template = function () {
			var data = new Object();
			return UI.renderWithData(Template.home, data);
		};
	},
	render: function()  {
		this.$el.html(UI.insert(this.template(), this.el));
		return this;
	},
	runSearch: function(evt)  {
		var form_data = {};
		$.each($('#search-form').serializeArray(), function() {
		    if(this.name != 'submit' && this.name != 'cancel')  {
		    	form_data[this.name] = this.value;
		    }
		});
		//console.log(JSON.stringify(form_data, null, 1));
		this.getDplaData(form_data);
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
        	console.log(err)
        }
	}
});