// brush: "javascript" aliases: ["js", "actionscript"]

Syntax.register('javascript', function(brush) {
	var keywords = ["break", "case", "catch", "continue", "default", "delete", "do", "else", "for", "if", "in", "instanceof", "new", "return", "super", "switch", "throw", "true", "try", "typeof", "var", "while", "with", "prototype"];
	
	var operators = ["+", "*", "/", "-", "&", "|", "~", "!", "%", "<", "=", ">"];
	var values = ["function", "this", "true", "false", "null", /[0-9]+(\.[0-9]+)?/g];
		
	brush.push(values, {klass: 'constant', allow: []});
	brush.push(keywords, {klass: 'keyword', allow: []});
	brush.push(operators, {klass: 'operator', allow: []});
	
	brush.push({pattern: /\b_*[A-Z][\w:]+/g, klass: 'type', allow: []});
	
	brush.push(Syntax.lib.cStyleComment);
	brush.push(Syntax.lib.cppStyleComment);
	brush.push(Syntax.lib.webLink);
	
	// Strings
	brush.push(Syntax.lib.singleQuotedString);
	brush.push(Syntax.lib.doubleQuotedString);
	brush.push(Syntax.lib.stringEscape);
	
	brush.push(Syntax.lib.cStyleFunction);
});

