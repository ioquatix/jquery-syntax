// brush: "html" aliases: ["xml"]

/* 
	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.

	See <jquery.syntax.js> for licensing details.

	Copyright 2010 Samuel Williams. All rights reserved.
*/

Syntax.brushes.dependency('html', 'javascript');
Syntax.brushes.dependency('html', 'css');

Syntax.register('html', function(brush) {
	brush.push({
		pattern: /<script(.*?)type\=.?text\/javascript.?(.*?)>((.|\n)*?)<\/script>/gmi,
		matches: Syntax.parseScriptFunction('javascript', 3),
		allow: '*'
	});
	
	brush.push({
		pattern: /<style(.*?)type=.?text\/css.?(.*?)>((.|\n)*?)<\/style>/gmi,
		matches: Syntax.parseScriptFunction('css', 3),
		allow: '*'
	});
	
	brush.push({
		pattern: /<%=?(.*?)(%>)/g,
		klass: 'instruction',
		allow: ['string']
	});
	
	brush.push({
		pattern: /<\?(.*?)\?>/gm,
		klass: 'instruction',
		allow: ['string']
	});

	brush.push({
		pattern: /<(\!DOCTYPE(.*?))>/g,
		matches: Syntax.extractMatches({klass: 'doctype'})
	});
	
	brush.push({
		pattern: /<\W?(\w+).*?>/g,
		matches: Syntax.extractMatches({klass: 'tag', allow: ['attribute']})
	});
	
	brush.push({
		pattern: /(\w+)=(".*?"|'.*?'|\S+)/g,
		matches: Syntax.extractMatches({klass: 'attribute'}, {klass: 'string'})
	});
	
	brush.push({
		pattern: /&\w+;/g,
		klass: 'entity'
	});
	
	brush.push({
		pattern: /(%[0-9a-f]{2})/gi,
		klass: 'percent-escape',
		only: ['html', 'string']
	});

	brush.push(Syntax.lib.xmlComment);

	brush.push(Syntax.lib.singleQuotedString);
	brush.push(Syntax.lib.doubleQuotedString);
});

