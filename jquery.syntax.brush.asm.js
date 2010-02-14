// brush: "asm" aliases: []

Syntax.register('asm', function(brush) {
	brush.push(Syntax.lib.cStyleComment);
	brush.push(Syntax.lib.cppStyleComment);
	
	brush.push({
		pattern: /^\s+([a-zA-Z]+)/gm,
		matches: Syntax.singleMatchFunction(1, {klass: 'function'})
	});
	
	brush.push({pattern: /\.[a-zA-Z_][a-zA-Z0-9_]*/gm, klass: 'directive'});
	
	brush.push({pattern: /[a-zA-Z_][a-zA-Z0-9_]*:/gm, klass: 'label'});
	
	brush.push({pattern: /(-[0-9]+)|(\b[0-9]+)|(\$[0-9]+)/g, klass: 'constant'});
	brush.push({pattern: /(\-|\b|\$)(0x[0-9a-f]+|[0-9]+)/g, klass: 'constant'});
	
	brush.push({pattern: /%\w+/g, klass: 'register'});
	
	brush.push(Syntax.lib.perlStyleComment);
});
