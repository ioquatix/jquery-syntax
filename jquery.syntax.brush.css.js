// brush: "css" aliases: []

/* 
	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.

	See <jquery.syntax.js> for licensing details.

	Copyright 2010 Samuel Williams. All rights reserved.
*/

Syntax.register('css', function(brush) {
	brush.push({
		pattern: /\(.*?\)/g,
		disallow: ['property']
	});
	
	brush.push({
		pattern: /\s*([\:\.\[\]\"\'\=\s\w#\.\-,]+)\s+\{/gm,
		matches: Syntax.singleMatchFunction(1, {klass: 'selector', allow: ['string']})
	});
	
	brush.push({
		pattern: /#[0-9a-f]{6}/gi,
		klass: 'hex-color'
	});
		
	brush.push(Syntax.lib.cStyleComment);
	brush.push(Syntax.lib.webLink);
	
	brush.push({
		pattern: /\{(.|\n)*?\}/g,
		klass: 'properties'
	});
	
	brush.push({
		pattern: /\:(.*?(?=\})|(.|\n)*?(?=(\}|\;)))/g,
		matches: Syntax.singleMatchFunction(1, {klass: 'value', only: ['properties']})
	});
	
	brush.push({pattern: /[\-\w]+:/g, klass: 'property', allow: []});
	
	// Strings
	brush.push(Syntax.lib.singleQuotedString);
	brush.push(Syntax.lib.doubleQuotedString);
	brush.push(Syntax.lib.stringEscape);
	
	brush.push(Syntax.lib.cStyleFunction);
});

