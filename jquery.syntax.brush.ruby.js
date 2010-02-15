// brush: "ruby" aliases: []

/* 
	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.

	See <jquery.syntax.js> for licensing details.

	Copyright 2010 Samuel Williams. All rights reserved.
*/

Syntax.lib.rubyStyleFunction = {pattern: /(?:def\s+|\.)([a-z_][a-z0-9_]+)/gi, matches: Syntax.extractMatches({klass: 'function'})};
Syntax.lib.rubyStyleSymbol = {pattern: /:\w+/g, klass: 'constant'};

Syntax.register('ruby', function(brush) {
	var keywords = ["alias", "and", "begin", "break", "case", "class", "def", "define_method", "defined", "do", "each", "else", "elsif", "end", "ensure", "false", "for", "if", "in", "module", "new", "next", "nil", "not", "or", "raise", "redo", "rescue", "retry", "return", "self", "super", "then", "throw", "true", "undef", "unless", "until", "when", "while", "yield"];
	
	var operators = ["+", "*", "/", "-", "&", "|", "~", "!", "%", "<", "=", ">"];
	var values = ["this", "true", "false", "nil", /[0-9]+(\.[0-9]+)?/g];
	
	var access = ["private", "public"];
	
	brush.push(access, {klass: 'access'});
	brush.push(values, {klass: 'constant'});
	
	brush.push({pattern: /(@+|\$)[\w]+/g, klass: 'variable'});
	
	brush.push({pattern: /_*[A-Z][\w:]+/g, klass: 'type'});
	brush.push(keywords, {klass: 'keyword'});
	brush.push(operators, {klass: 'operator'});
	
	brush.push(Syntax.lib.rubyStyleSymbol);
	
	brush.push(Syntax.lib.perlStyleComment);
	brush.push(Syntax.lib.webLink);
	
	// Strings
	brush.push(Syntax.lib.singleQuotedString);
	brush.push(Syntax.lib.doubleQuotedString);
	brush.push(Syntax.lib.stringEscape);
	
	brush.push(Syntax.lib.rubyStyleFunction);
	brush.push(Syntax.lib.cStyleFunction);
});

