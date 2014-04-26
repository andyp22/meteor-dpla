QueryGenerator = function(baseUrl, version, api_key)  {
	this.baseUrl = baseUrl;
	this.version = version;
	this.api_key = api_key;
};

QueryGenerator.prototype.getBaseQueryUrl = function()  {
	return this.baseUrl + '/' + this.version + '/';
};

QueryGenerator.prototype.getQuery = function(search_data)  {
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
	search_term = (search_data.search_term_join === 'or') ? search_data.search_term.split(' ').join('+OR+'): search_data.search_term.split(' ').join('+AND+');
    return this.getBaseQueryUrl() + 'items?' + limit + '&q=' + search_term + '&page_size=' + count + '&api_key=' + this.api_key;
};


        
