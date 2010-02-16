//	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.
//	Copyright 2010 Samuel Williams. All rights reserved.
//	See <jquery.syntax.js> for licensing details.

function createWindow (url, name, width, height, options) {
	var x = (screen.width - width) / 2, y = (screen.height - height) / 2;
		
	options +=	',left=' + x +
					',top=' + y +
					',width=' + width +
					',height=' + height;
					
	options = options.replace(/^,/, '');

	var win = window.open(url, name, options);
	
	win.focus();
	
	return win;
}

function dirname(path) {
	return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
}

Syntax.layouts.table = function(options, code, container) {
	var table = $('<table class="syntax"></table>'), tr = null, td = null, a = null
	var line = 1;
	
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
		
		td.innerHTML += this.innerHTML;
		tr.appendChild(td);
		
		table[0].appendChild(tr);
		line = line + 1;
	});
	
	// Toolbar
	var toolbar = $('<div class="toolbar"></div>');
	
	a = $('<a href="#">View Raw Code</a>');
	
	a.click(function() {
		var win = createWindow('#', '_blank', 700, 500, 'location=0, resizable=1, menubar=0, scrollbars=1');

		win.document.write('<html><head><base href="' + dirname(window.location.href) + '/" /></head><body id="syntax-raw"><pre class="syntax">' + code.html() + '</pre></body></html>');

		win.document.close();

		$('link').each(function(){
			if (this.rel != 'stylesheet') {
				return;
			}
			
			var link = $('<link rel="stylesheet">', win.document);
			
			link.attr('type', this.type);
			link.attr('href', this.href);
			link.attr('media', this.media);
			
			$("head", win.document).append(link);
		});
		
		return false;
	});
	
	toolbar.append(a);
	toolbar.append($('<a href="http://www.oriontransfer.co.nz/software/jquery-syntax/" target="oriontransfer">?</a>'));
	
	$('td:eq(1)', table).prepend(toolbar);
	
	return table;
};
