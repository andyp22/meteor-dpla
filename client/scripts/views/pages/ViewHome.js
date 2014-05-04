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
			},
			"click .advanced-search-toggle": function(e)  {
				e.preventDefault();
				
			}
		};
		
		Template.advanced_search_form.events = {
			// Prevent the page reloading for links.
			"submit": function(e) {
           		e.preventDefault();
           		model.runSearch(e, '#advanced-search-form');
           		$("#advanced-search-form-container").slideToggle("fast");
			},
			"click .reset_btn": function(e) {
           		e.preventDefault();
           		console.log("reset");
           		model.resetSearch();
			},
			"click .cancel_btn": function(e) {
           		e.preventDefault();
           		model.resetSearch();
           		$("#advanced-search-form-container").slideToggle("fast");
			},
			"click .close_btn": function(e) {
           		e.preventDefault();
           		$("#advanced-search-form-container").slideToggle("fast");
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
				var mult = ($(document).height() > 20000) ? (($(document).height() > 40000) ? .95: .875) : .8;
				var more_height = $(document).height()*mult - $(window).height();
				if ($(window).scrollTop() >= more_height) {
			        model.loadMoreContent();
			    }
			});
		};
		
		Template.search_form.rendered = function()  {
			$(".advanced-search-toggle").click(function() {
                $("#advanced-search-form-container").slideToggle("fast");
            });
            $("#advanced-search-form-container").hide();
		};
		
		this.template = function () {
			var data = {
				advanced_search_fields: [
					{
						title: 'All Fields',
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