// brush: "clang" aliases: ["cpp", "c", "objective-c"]

Syntax.register('clang', function(brush) {
	var keywords = ["@interface", "@implementation", "@protocol", "@end", "@private", "@protected", "@public", "@try", "@throw", "@catch", "@finally", "@class", "@selector", "@encode", "@synchronized", "struct", "break", "continue", "else", "for", "switch", "case", "default", "enum", "goto", "register", "sizeof", "typedef", "volatile", "do", "extern", "if", "return", "static", "union", "while", "asm", "dynamic_cast", "namespace", "reinterpret_cast", "try", "explicit", "static_cast", "typeid", "catch", "operator", "template", "typename", "class", "friend", "private", "using", "const_cast", "inline", "public", "throw", "virtual", "mutable", "protected", "wchar_t"];
	
	var types = ["auto", "const", "double", "float", "int", "short", "char", "long", "signed", "unsigned", "bool", "void"];
	var operators = ["+", "*", "/", "-", "&", "|", "~", "!", "%", "<", "=", ">", "new", "delete"];
	var values = ["this", "true", "false", /[0-9]+(\.[0-9]+)?/g];
	
	brush.push(values, {
		klass: 'constant',
		children: null
	});
	
	brush.push({
		pattern: /#.*$/gmi,
		klass: 'preprocessor',
		children: null
	});
	
	brush.push({pattern: /\/\*[\s\S]*?\*\//gm, klass: 'comment', children: null});
	brush.push({pattern: /\/\/.*$/gm, klass: 'comment', children: null});
	
	brush.push({pattern: /".+?"/g, klass: 'string', children: 'escape'});
	brush.push({pattern: /\\./g, klass: 'escape'});
	
	brush.push(types, {klass: 'type', children: null})
	brush.push(keywords, {klass: 'keyword', children: null})
	brush.push(operators, {klass: 'operator', children: null})
	
	brush.push({
		pattern: /([a-z_][a-z0-9_]+)\s*(<.*?>)/gi,
		children: null,
		matches: function(token) {
			var name = new Syntax.Match(match.index, match[1].length, {klass: 'template', children: null}, match[1]);
			var arguments = new Syntax.Match(RegExp.indexOf(match, 2), match[2].length, {klass: 'arguments'}, match[2]);
			
			return [name, arguments]
		}	
	});
	
	brush.push({
		pattern: /([a-z_][a-z0-9_]+)\s*(\(.*?\))/gi, 
		matches: function(token) {
			var name = new Syntax.Match(match.index, match[1].length, {klass: 'function', children: null}, match[1]);
			var arguments = new Syntax.Match(RegExp.indexOf(match, 2), match[2].length, {klass: 'arguments'}, match[2]);
			
			return [name, arguments]
		}
	});
});

