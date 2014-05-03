/*
 * View logic for the home page.
 */
ViewHome = Backbone.View.extend({
	
	template: null,
	
	initialize: function()  {
		var self = this;
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
           		model.runSearch(e, '#search-form');
			}
		};
		
		Template.advanced_search_form.events = {
			// Prevent the page reloading for links.
			"submit": function(e) {
           		e.preventDefault();
           		model.runSearch(e, '#advanced-search-form');
			}
		};
		
		Template.home.datasets = function(e)  {
			var data = Session.get('datasets');
			$('#results-output').imagesLoaded( function() {
				self.initLayout();
			});
			return data;
		};
		
		Template.home.rendered = function()  {
			$(window).scroll(function () {
				self.top = $(window).scrollTop() + $(window).height() - $(window).height();
				if ($(window).scrollTop() == $(document).height() - $(window).height()) {
			        model.loadMoreContent();
			    }
			});
		};
		
		this.template = function () {
			var data = {
				advanced_search_fields: [
					{
						title: 'Any',
						id: 'any'
					},
					{
						title: 'Title',
						id: 'title'
					},
					{
						title: 'Author',
						id: 'author'
					},
					{
						title: 'Description',
						id: 'description'
					},
					{
						title: 'Location',
						id: 'location'
					}
				]
			};
			return UI.renderWithData(Template.home, data);
		};
	},
	render: function()  {
		this.$el.html(UI.insert(this.template(), this.el));
		return this;
	},
	initLayout: function()  {
		// initialize Masonry after all images have loaded  
		$('#results-output').imagesLoaded( function() {
			var container = document.querySelector('#results-output');
		    var msnry = new Masonry(container,{
				itemSelector: '.box',
				transitionDuration: '0.5s'
		    });
		});
	}
});