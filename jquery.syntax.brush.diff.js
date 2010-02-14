// brush: "diff" aliases: ["patch"]

/* 
	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.

	See <jquery.syntax.js> for licensing details.

	Copyright 2010 Samuel Williams. All rights reserved.
*/

Syntax.register('diff', function(brush) {
	brush.push({pattern: /^\+\+\+.*$/gm, klass: 'add'});
	brush.push({pattern: /^\-\-\-.*$/gm, klass: 'del'});
	
	brush.push({pattern: /^@@.*@@/gm, klass: 'offset'});
	
	brush.push({pattern: /^\+[^\+]{1}.*$/gm, klass: 'insert'});
	brush.push({pattern: /^\-[^\-]{1}.*$/gm, klass: 'remove'});
});

