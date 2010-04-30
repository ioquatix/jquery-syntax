// brush: "php" aliases: []

//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

Syntax.register('php', function(brush) {
	var keywords = ["abstract", "and", "as", "break", "case", "cfunction", "class", "const", "continue", "declare", "default", "die", "do", "echo", "else", "elseif", "enddeclare", "endfor", "endforeach", "endif", "endswitch", "endwhile", "extends", "extends", "for", "foreach", "function", "global", "if", "implements", "include", "include_once", "interface", "old_function", "or", "require", "require_once", "return", "static", "switch", "throw", "use", "var", "while", "xor"];
	
	var access = ["private", "protected", "public"];
	
	var operators = ["+", "*", "/", "-", "&", "|", "~", "!", "%", "<", "=", ">", "[", "]", "new"];
	
	var values = ["this", "true", "false", /[0-9]+(\.[0-9]+)?/g];
	
	brush.push(values, {klass: 'constant'});
	//brush.push(types, {klass: 'type'});
	brush.push(keywords, {klass: 'keyword'});
	brush.push(operators, {klass: 'operator'});
	brush.push(access, {klass: 'access'});
	
	// ClassNames (CamelCase)
	brush.push(Syntax.lib.camelCaseType);
	brush.push(Syntax.lib.cStyleFunction);
	
	brush.push(Syntax.lib.cStyleComment);
	brush.push(Syntax.lib.cppStyleComment);
	brush.push(Syntax.lib.perlStyleComment);
	brush.push(Syntax.lib.webLink);
	
	// Strings
	brush.push(Syntax.lib.singleQuotedString);
	brush.push(Syntax.lib.doubleQuotedString);
	brush.push(Syntax.lib.stringEscape);
	
	brush.processes['function'] = Syntax.lib.webLinkProcess("http://www.php.net/manual-lookup.php?pattern=");
});

