// brush: "xml" aliases: []

//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

Syntax.register('xml', function(brush) {
	brush.push({
		pattern: /(<!(\[CDATA\[)([\s\S]*?)(\]\])>)/gm,
		matches: Syntax.extractMatches(
			{klass: 'cdata', allow: ['cdata-content', 'cdata-tag']},
			{klass: 'cdata-tag'},
			{klass: 'cdata-content'},
			{klass: 'cdata-tag'}
		)
	});
	
	brush.push(Syntax.lib.xmlComment);
	
	// /[\s\S]/ means match anything... /./ doesn't match newlines
	brush.push({
		pattern: /<[^>]+>/g,
		klass: 'tag',
		allow: '*'
	});
	
	brush.push({
		pattern: /<\/?((?:[^:\s>]+:)?)([^\s>]+)(\s[^>]*)?\/?>/g,
		matches: Syntax.extractMatches({klass: 'namespace'}, {klass: 'tag-name'})
	});
	
	brush.push({
		pattern: /([\w_\-\.]+)=(".*?"|'.*?'|\S+)/g,
		matches: Syntax.extractMatches({klass: 'attribute', only: ['tag']}, {klass: 'string', only: ['tag']}),
	});
	
	brush.push({
		pattern: /&\w+;/g,
		klass: 'entity'
	});
	
	brush.push({
		pattern: /(%[0-9a-f]{2})/gi,
		klass: 'percent-escape',
		only: ['string']
	});
	
	brush.push(Syntax.lib.singleQuotedString);
	brush.push(Syntax.lib.doubleQuotedString);
	
	brush.push(Syntax.lib.webLink);
});

