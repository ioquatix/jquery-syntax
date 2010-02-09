Syntax.layouts.table = function(options, code, container) {
	var table = $('<table>'), tr = null, td = null;
	var line = 1;
	
	table.addClass('syntax');
	
	code.children().each(function() {
		tr = $('<tr>').addClass('line', 'line-' + line);
		
		td = $('<td>').addClass('number').text(line);
		tr.append(td);
		
		td = $('<td>').addClass('source');
		td.append(this);
		tr.append(td);
		
		table.append(tr);
		line = line + 1;
	});
	
	return table;
}