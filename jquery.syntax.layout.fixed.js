//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

Syntax.layouts.fixed = function(options, code, container) {
	var fixed = jQuery('<div class="fixed syntax"></div>'), line = 1, space = /^\s*$/;
	
	var codeTable = document.createElement('table');
	
	var numbersColumn = document.createElement('div');
	numbersColumn.className = "numbers-column";
	var codeColumn = document.createElement('div');
	codeColumn.className = "code-column";
	
	// Source code
	code.children().each(function() {
		var lineNumber = document.createElement('div');
		lineNumber.className = "line ln" + line
		lineNumber.innerHTML = line;
		numbersColumn.appendChild(lineNumber);
		
		var lineCode = document.createElement('td');
		lineCode.className = "source "  + this.className;
		
		if (line % 2) {
			lineCode.className += " alt";
		}
		
		if (lineCode == 1) {
			lineNumber.className += " first"
		}
		
		// Thanks to Michael for suggesting the obvious :)
		lineCode.innerHTML = this.innerHTML.replace(/\n/g, "<br/>");
		
		var tr = document.createElement('tr');
		tr.appendChild(lineCode);
		codeTable.appendChild(tr);
		
		line = line + 1;
	});
	
	codeColumn.appendChild(codeTable);
	
	fixed[0].appendChild(numbersColumn);
	fixed[0].appendChild(codeColumn);
	
	return fixed;
};
