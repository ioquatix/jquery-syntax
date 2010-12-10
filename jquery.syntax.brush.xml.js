// brush: "xml" aliases: []

//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

Syntax.register('xml', function(brush) {
	// /[\s\S]/ means match anything... /./ doesn't match newlines
	
	brush.push({
		pattern: /<\/?((?:[\w]+:)?)([\w]+)[\s\S]*?>/g,
		matches: Syntax.extractMatches({klass: 'namespace', allow: ['attribute']}, {klass: 'tag', allow: ['attribute']})
	});
	
	brush.push({
		pattern: /(\w+)=(".*?"|'.*?'|\S+)/g,
		matches: Syntax.extractMatches({klass: 'attribute'}, {klass: 'string'})
	});
	
	brush.push({
		pattern: /&\w+;/g,
		klass: 'entity'
	});
	
	// only: 'html', 
	brush.push({
		pattern: /(%[0-9a-f]{2})/gi,
		klass: 'percent-escape',
		only: ['string']
	});
   
	brush.push(Syntax.lib.xmlComment);
   
	brush.push(Syntax.lib.singleQuotedString);
	brush.push(Syntax.lib.doubleQuotedString);
	
	brush.push(Syntax.lib.webLink);
});

