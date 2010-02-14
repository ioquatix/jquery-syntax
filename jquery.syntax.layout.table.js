/* 
	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.

	See <jquery.syntax.js> for licensing details.

	Copyright 2010 Samuel Williams. All rights reserved.
*/

function createWindow (url, name, width, height, options) {
	var x = (screen.width - width) / 2, y = (screen.height - height) / 2;
		
	//options +=	',left=' + x +
	//				',top=' + y +
	//				',width=' + width +
	//				',height=' + height;
	//				
	options = options.replace(/^,/, '');

	var win = window.open(url, name, options);
	
	win.focus();
	
	return win;
}

Syntax.layouts.table = function(options, code, container) {
	var table = $('<table>'), tr = null, td = null, a = null, toolbar = null
	var line = 1;
	
	table.addClass('syntax');
	
	// Toolbar
	toolbar = document.createElement('div');
	toolbar.className = "toolbar";
	
	a = document.createElement('a');
	a.href = "#";
	a.innerHTML = "View Raw Code";
	
	a.onclick = function() {
		var win = createWindow('#', '_blank', 700, 500, 'location=0, resizable=1, menubar=0, scrollbars=1, title=Raw');

		win.document.write('<html><head></head><body><pre class="syntax">' + code.html() + '</pre></body></html>');

		$('link').each(function(){
			if (this.rel != 'stylesheet') {
				return;
			}
			
			window.console.log(this.href);
			var link = $('<link rel="stylesheet">', win.document);
			
			link.attr('type', this.type);
			link.attr('href', this.href);
			link.attr('media', this.media);
			
			$("head", win.document).append(link);
		});
		
		debugger
		
		win.document.close();
		win.document.title = "Raw Source Code";
	};
	
	toolbar.appendChild(a);

	a = document.createElement('a');
	a.href = "http://www.oriontransfer.co.nz/software/jquery-syntax/";
	a.innerHTML = "?";
	toolbar.appendChild(a);
	
	// Source code
	code.children().each(function() {
		tr = document.createElement('tr');
		tr.className = "line ln" + line;
		
		if (line % 2) {
			tr.className += " alt";
		}
		
		td = document.createElement('td');
		td.className = "number";
		td.innerHTML = line;
		tr.appendChild(td);
		
		td = document.createElement('td');
		td.className = "source " + this.className;
		td.innerHTML = this.innerHTML;
		tr.appendChild(td);
		
		if (toolbar) {
			td.appendChild(toolbar);
			toolbar = null;
		}
		
		table[0].appendChild(tr);
		line = line + 1;
	});
	
	$('.href', table).each(function(){
		$(this).replaceWith($('<a>').attr('href', this.innerHTML).text(this.innerHTML));
	});
	
	return table;
};
