//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

Syntax.layouts.list = function(options, code, container) {
	var list = jQuery('<ol class="syntax highlighted"></ol>'), line = 1, space = /^\s*$/;
	
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
		
		if (!this.innerHTML.match(space)) {
			div.innerHTML = Syntax.breakWhitespace(this.innerHTML);
		} else {
			div.innerHTML = "&nbsp;";
		}
		
		li.appendChild(div);
		list[0].appendChild(li);
		
		line = line + 1;
	});
	
	return list;
};
