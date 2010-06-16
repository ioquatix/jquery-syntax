//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

Syntax.layouts.list = function(options, code, container) {
	var listTag = options.listTag || 'ol';

	var list = jQuery('<' + listTag + ' class="syntax highlighted">'), line = 1, space = /^\s*$/;
	var toolbar = jQuery('<div class="toolbar">');

	// Grab a copy of the HTML..
	var codeText = Syntax.getCDATA(container);
	
	// Source code
	code.children().each(function() {
		var li = document.createElement('li');
		li.className = "line ln" + line
		
		if (line % 2) {
			li.className += " alt";
		}
		
		if (line == 1) {
			li.className += " first"
		}
		
		var div = document.createElement('div');
		div.className = "source "  + this.className;
		
		div.appendChild(this);
		
		li.appendChild(div);
		list[0].appendChild(li);
		
		line = line + 1;
	});
	
	var rawCode = jQuery('<div class="raw"><textarea class="syntax">');
	$('textarea', rawCode).text(codeText);
	
	a = jQuery('<a href="#">View Raw Code</a>');
	a.click(function () {
		if ($(list).is(':visible')) {
			$('textarea', rawCode).height($(list).height());
			$(list).replaceWith(rawCode);
		} else {
			$(rawCode).replaceWith(list);
		}
	});
	
	toolbar.append(a);
	toolbar.append('<a href="http://www.oriontransfer.co.nz/software/jquery-syntax" target="oriontransfer">?</a>');
	
	return jQuery('<div class="syntax-container">').append(toolbar).append(list);
};
