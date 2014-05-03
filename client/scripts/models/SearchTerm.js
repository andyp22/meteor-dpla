/**
 * 
 * 
 * @class SearchTerm
 */
SearchTerm = function(search_term, join, options)  {
	this.search_term_any = this.getSafeSearchTerm(search_term);
	this.search_term_join_any = join || 'and';
	
	for(var elm in options)  {
		this[elm] = options[elm];
	}
};
SearchTerm.prototype.getSafeSearchTerm = function(search_term)  {
	var punctuationless = search_term.replace(/[\.,-\/#!$%\^&;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
	return punctuationless.replace(/\s{2,}/g," ");	
};
