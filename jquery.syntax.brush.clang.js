// brush: "clang" aliases: ["cpp", "c++", "c", "objective-c"]

/* 
	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.

	See <jquery.syntax.js> for licensing details.

	Copyright 2010 Samuel Williams. All rights reserved.
*/

Syntax.register('clang', function(brush) {
	var keywords = ["@interface", "@implementation", "@protocol", "@end", "@try", "@throw", "@catch", "@finally", "@class", "@selector", "@encode", "@synchronized", "@property", "struct", "break", "continue", "else", "for", "switch", "case", "default", "enum", "goto", "register", "sizeof", "typedef", "volatile", "do", "extern", "if", "return", "static", "union", "while", "asm", "dynamic_cast", "namespace", "reinterpret_cast", "try", "explicit", "static_cast", "typeid", "catch", "operator", "template", "class", "const_cast", "inline", "throw", "virtual", "mutable", "wchar_t"];
	
	var access = ["@private", "@protected", "@public", "private:", "protected:", "public:", "friend", "using"];
	
	var types = ["auto", "const", "double", "float", "int", "short", "char", "long", "signed", "unsigned", "bool", "void", "typename", "id", "register"];
	var operators = ["+", "*", "/", "-", "&", "|", "~", "!", "%", "<", "=", ">", "[", "]", "new", "delete"];
	var values = ["this", "true", "false", /[0-9]+(\.[0-9]+)?/g];
	
	brush.push(values, {klass: 'constant', allow: []});
	brush.push(types, {klass: 'type', allow: []});
	brush.push(keywords, {klass: 'keyword', allow: []});
	brush.push(operators, {klass: 'operator', allow: []});
	brush.push(access, {klass: 'access', allow: []});
	
	// Objective-C classes
	brush.push({pattern: /\b[A-Z][\w]*\b/g, klass: 'type', allow: []});
	
	brush.push({
		pattern: /#.*$/gmi,
		klass: 'preprocessor',
		allow: ['string']
	});
	
	brush.push(Syntax.lib.cStyleComment);
	brush.push(Syntax.lib.cppStyleComment);
	
	// Objective-C style functions
	brush.push({pattern: /\w+:(?=.*(\]|;|\{))/g, klass: 'function', allow: []});
	
	brush.push({
		pattern: /[^:\[]\s+(\w+)(?=\])/g,
		matches: Syntax.singleMatchFunction(1, {klass: 'function', allow: []})
	});
	
	brush.push({
		pattern: /-\s*(\(.+?\))?\s*(\w+)\s*\{/g,
		matches: Syntax.singleMatchFunction(2, {klass: 'function', allow: []})
	});
	
	// Strings
	brush.push(Syntax.lib.singleQuotedString);
	brush.push(Syntax.lib.doubleQuotedString);
	brush.push(Syntax.lib.stringEscape);
	
	brush.push(Syntax.lib.cStyleFunction);
});

