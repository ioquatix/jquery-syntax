//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

Syntax.layouts.fixed = function(options, code, container) {
	var fixed = jQuery('<div class="fixed syntax highlighted">'), line = 1, space = /^\s*$/;
	var toolbar = jQuery('<div class="toolbar">');

	// Grab a copy of the HTML..
	var codeText = Syntax.getCDATA(container);

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
	
	fixed.append(numbersColumn);
	fixed.append(codeColumn);
	
	var rawCode = jQuery('<div class="raw"><textarea class="syntax">');
	$('textarea', rawCode).text(codeText);
	
	a = jQuery('<a href="#">View Raw Code</a>');
	a.click(function (event) {
		event.preventDefault();
		
		if ($(fixed).is(':visible')) {
			$('textarea', rawCode).height($(fixed).height());
			$(fixed).replaceWith(rawCode);
		} else {
			$(rawCode).replaceWith(fixed);
		}
	});
	
	toolbar.append(a);
	toolbar.append('<a href="http://www.oriontransfer.co.nz/software/jquery-syntax" target="oriontransfer">?</a>');
	
	return jQuery('<div class="syntax-container">').append(toolbar).append(fixed);
};
