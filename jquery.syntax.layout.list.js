//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

Syntax.layouts.list = function(options, code, container) {
	var list = jQuery('<ol class="syntax"></ol>'), li = null, line = 1;
	
	// Source code
	code.children().each(function() {
		li = document.createElement('li');
		li.className = "source line ln" + line + " " + this.className;
		
		if (line % 2) {
			li.className += " alt";
		}
		
		if (line == 1) {
			li.className += " first"
		}
		
		li.innerHTML += this.innerHTML;
		list[0].appendChild(li);
		
		line = line + 1;
	});
	
	return list;
};
