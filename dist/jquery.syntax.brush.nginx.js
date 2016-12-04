// brush: "nginx" aliases: []

//	This file is part of the "jQuery.Syntax" project, and is distributed under the MIT License.
//	Copyright (c) 2011 Samuel G. D. Williams. <http://www.oriontransfer.co.nz>
//	See <jquery.syntax.js> for licensing details.

Syntax.register('nginx', function(brush) {
	var keywords = ["server", "location", "http", "if", "break", "return"];
	
	brush.push({pattern: /(\$)[\w]+/g, klass: 'variable'});
	
	brush.push(keywords, {klass: 'keyword'});
	
	brush.push(Syntax.lib.perlStyleComment);
	brush.push(Syntax.lib.singleQuotedString);
	brush.push(Syntax.lib.doubleQuotedString);
	
	brush.push(Syntax.lib.webLink);
});

