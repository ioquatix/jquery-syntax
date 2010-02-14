// brush: "diff" aliases: ["patch"]

Syntax.register('diff', function(brush) {
	brush.push({pattern: /^\+\+\+.*$/gm, klass: 'add'});
	brush.push({pattern: /^\-\-\-.*$/gm, klass: 'del'});
	
	brush.push({pattern: /^@@.*@@/gm, klass: 'offset'});
	
	brush.push({pattern: /^\+[^\+]{1}.*$/gm, klass: 'insert'});
	brush.push({pattern: /^\-[^\-]{1}.*$/gm, klass: 'remove'});
});

