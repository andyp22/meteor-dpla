/*
 * View logic for the home page.
 */
ViewHome = Backbone.View.extend({
	
	template: null,
	
	initialize: function()  {
		var model = this.model;
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
           		model.runSearch(e);
			}
		};
		
		model.getDplaData(new SearchTerm("cats"));
	    
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
	}
});