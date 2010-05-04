// brush: "haskell" aliases: [""]

//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

Syntax.lib.haskellSingleLineStyleComment = {pattern: /\-\- .*$/gm, klass: 'comment', allow: ['href']};
Syntax.lib.haskellMultiLineStyleComment = {pattern: /\{\-[\s\S]*?\-\}/gm, klass: 'comment', allow: ['href']};

Syntax.register('haskell', function(brush) {
	var keywords = ["as", "case", "of", "class", "data", "data family", "data instance", "default", "deriving", "deriving instance", "do", "forall", "foreign", "hiding", "if", "then", "else", "import", "infix", "infixl", "infixr", "instance", "let", "in", "mdo", "module", "newtype", "proc", "qualified", "rec", "type", "type family", "type instance", "where"];
	
	var operators = ["`", "|", "\\", "-", "-<", "-<<", "->", "*", "?", "??", "#", "<-", "@", "!", "::", "_", "~", ">", ";", "{", "}"];
	
	var values = ["True", "False", /[0-9]+(\.[0-9]+)?/g];
	
	brush.push(values, {klass: 'constant'});
	brush.push(keywords, {klass: 'keyword'});
	brush.push(operators, {klass: 'operator'});
	
	// Camelcase Types
	brush.push(Syntax.lib.camelCaseType);
	
	// Objective-C classes
	brush.push(Syntax.lib.haskellSingleLineStyleComment);
	brush.push(Syntax.lib.haskellMultiLineStyleComment);
	
	// Strings
	brush.push(Syntax.lib.singleQuotedString);
	brush.push(Syntax.lib.doubleQuotedString);
	brush.push(Syntax.lib.stringEscape);
});

