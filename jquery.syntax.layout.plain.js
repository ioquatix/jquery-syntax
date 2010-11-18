//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

// This layout doesn't work correctly in IE6, but is fine in all other tested browsers.
Syntax.layouts.plain = function(options, code, container) {
	var toolbar = jQuery('<div class="toolbar">');
	
	var scrollContainer = jQuery('<div class="syntax plain highlighted">');
	code.removeClass('syntax');
	
	scrollContainer.append(code);
	
	return jQuery('<div class="syntax-container">').append(toolbar).append(scrollContainer);
};
