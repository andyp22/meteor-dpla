QueryGenerator = function(baseUrl, version, api_key)  {
	this.baseUrl = baseUrl;
	this.version = version;
	this.api_key = api_key;
};

QueryGenerator.prototype.getBaseQueryUrl = function()  {
	return this.baseUrl + '/' + this.version + '/';
};

QueryGenerator.prototype.getQuery = function(search_data)  {
	var count = 10;
	var query = '';
	
	if(search_data.search_term_any)  {
		var q = 'q=' + this.getTermQuery(search_data.search_term_any, search_data.search_term_join_any);
		query = this.updateQuery(q, query);
	}
	if(search_data.search_term_title)  {
		var q = 'sourceResource.title=' + this.getTermQuery(search_data.search_term_title, search_data.search_term_join_title);
		query = this.updateQuery(q, query);
	}
	if(search_data.search_term_author)  {
		var q = 'sourceResource.creator=' + this.getTermQuery(search_data.search_term_author, search_data.search_term_join_author);
		query = this.updateQuery(q, query);
	}
	if(search_data.search_term_description)  {
		var q = 'sourceResource.description=' + this.getTermQuery(search_data.search_term_description, search_data.search_term_join_description);
		query = this.updateQuery(q, query);
	}
	if(search_data.search_term_location)  {
		var q = 'sourceResource.spatial=' + this.getTermQuery(search_data.search_term_location, search_data.search_term_join_location);
		query = this.updateQuery(q, query);
	}
	
	query = this.updateQuery(this.getDocTypesQuery(search_data), query);
	query = this.updateQuery(this.getTemporalQuery(search_data), query);
	
    console.log("Query: "+query);
    return this.getBaseQueryUrl() + 'items?' + query + '&page_size=' + count + '&api_key=' + this.api_key;
};

QueryGenerator.prototype.updateQuery = function(term, query)  {
	if(term != '')  {
		if(query != '')  {
			query += '&';
		}
		query += term;
	}
	return query;
};

QueryGenerator.prototype.getTermQuery = function(search_term, search_type)  {
	return (search_type === 'or') ? search_term.split(' ').join('+OR+'): search_term.split(' ').join('+AND+');
};

QueryGenerator.prototype.getDocTypesQuery = function(search_data)  {
	var q = "";
	var asf_pre = "asf-types-";
	var type_limits = new Array();
	for(var elm in search_data)  {
		if(elm.indexOf(asf_pre) > -1)  {
			var _tl = elm.substr(asf_pre.length);
			switch(_tl)  {
				case "text":
					type_limits.push('text');
					break;
				case "images":
					type_limits.push('image');
					break;
				case "sounds":
					type_limits.push('sound');
					break;
				case "videos":
					type_limits.push('"moving image"');
					break;
			}
		}
	}
	
	if(type_limits.length > 0)  {
		q = 'sourceResource.type=' + type_limits.join('+OR+');
	}
	return q;
};

QueryGenerator.prototype.getTemporalQuery = function(search_data)  {
	var temporal = '';
	if(search_data.search_term_after_date && search_data.search_term_before_date)  {
		temporal = 'sourceResource.temporal.begin=' + search_data.search_term_after_date + '&sourceResource.temporal.end=' + search_data.search_term_before_date;
	} else if(search_data.search_term_after_date)  {
		temporal = 'sourceResource.temporal.begin=' + search_data.search_term_after_date;
	} else if(search_data.search_term_before_date)  {
		temporal = 'sourceResource.temporal.end=' + search_data.search_term_before_date;
	}
	return temporal;
};

        
