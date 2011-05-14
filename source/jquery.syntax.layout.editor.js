//	This file is part of the "jQuery.Syntax" project, and is distributed under the MIT License.
//	Copyright (c) 2011 Samuel G. D. Williams. <http://www.oriontransfer.co.nz>
//	See <jquery.syntax.js> for licensing details.

Syntax.Editor = function(container, text) {
	this.container = container;
	this.current = this.getLines();
}

// This function generates an array of accumulated line offsets e.g.
// If line 8 is actually in child element 6, indices[8] = -2
Syntax.Editor.prototype.getLines = function() {
	var children = this.container.children, lines = [], offsets = [];
	
	for (var j = 0; j < children.length; j += 1) {
		if (children[j].nodeType == 3) {
			$(children[j]).remove();
		}
	}
	
	for (var i = 0; i < children.length; i += 1) {
		var childLines = Syntax.getCDATA([children[i]]).split('\n');
		
		childLines.pop();
		
		for (var j = 0; j < childLines.length; j += 1) {
			offsets.push(i - lines.length);
			lines.push(childLines[j]);
		}
	}
	
	return {lines: lines, offsets: offsets};
}

// This function updates the editor's internal state with regards to lines changed.
// This can be lines added, removed or modified partially. This function returns
// a list of lines which are different between the previous set of lines and the
// updated set of lines.
// This algorithm is not a general diff algorithm because we expect three cases only:
//		1: A single line was modified (most common case)
//		2: Some lines were removed (selection -> delete)
//		3: Some lines were added (paste)
Syntax.Editor.prototype.updateChangedLines = function() {
	var result = {};
	
	var updated = this.getLines();
	
	// Find the sequence of lines at the start preceeding the change:
	var i = 0, j = 0;
	while (i < this.current.lines.length && j < updated.lines.length) {
		if (this.current.lines[i] == updated.lines[j]) {
			i += 1;
			j += 1;
		} else {
			break;
		}
	}
	
	// The length of the initial segment which hasn't changed:
	result.start = j;
	
	// Find the sequence of lines at the end proceeding the change:
	i = this.current.lines.length, j = updated.lines.length;
	while (i > result.start && j > result.start) {
		if (this.current.lines[i-1] == updated.lines[j-1]) {
			i -= 1;
			j -= 1;
		} else {
			break;
		}
	}
	
	// The index of the remaining portion which hasn't changed:
	result.end = j;
	// The index to the original set of lines which were the same:
	result.originalEnd = i;
	
	// Did we add or remove some lines?
	result.difference = updated.lines.length - this.current.lines.length;
	
	// This should be augmented to improve the above.
	while (result.start > 0) {
		if (updated.offsets[result.start] == updated.offsets[result.start-1])
			break;
		
		result.start -= 1;
	}
	
	if (result.difference > 0) {
		while (result.end < (updated.lines.length-1)) {
			if (updated.offsets[result.end-1] == updated.offsets[result.end])
				break;
			
			result.end += 1;
			result.originalEnd += 1;
		}
	}
	
	// Update the internal state for the next update.
	this.current = updated;
	this.changed = result;
	
	return result;
}

Syntax.Editor.prototype.textForLines = function(start, end) {
	return this.current.lines.slice(start, end).join('\n') + '\n';
}

Syntax.Editor.prototype.updateLines = function(changed, newLines) {
	console.log("updateLines", changed.start, changed.originalEnd, "->", changed.start, changed.end, changed);
	
	// We have two cases to handle, either we are replacing lines
	//	(1a) Replacing old lines with one more more new lines (update)
	//	(1b) Replacing old lines with zero new lines (removal)
	// Or we are inserting lines
	//	(2a) We are inserting lines at the start of the element
	//	(2b) We are inserting lines after an existing element.
	
	if (changed.start != changed.originalEnd) {
		// When text is deleted, at most two elements can remain:
		//	(1) Whatever was partially remaining on the first line.
		//	(2) Whatever was partially remaining on the last line.
		// All other lines have already been removed by the container.
		// changed.difference tells us how many elements have already been removed.
		
		// Cases (1a) and (1b)
		var start = changed.start, end = changed.originalEnd;
		
		if (changed.difference < 0)
			end += changed.difference;
	
		console.log("original", start, end);
	
		start += this.current.offsets[start];
		//end += this.current.offsets[end];
	
		console.log("slice", start, end)
	
		var oldLines = Array.prototype.slice.call(this.container.children, start, end);
	
		console.log("Replacing old lines", oldLines, "with", newLines);
	
		$(oldLines).replaceWith(newLines);
	} else {
		if (changed.start == 0)
			$(this.container).prepend(newLines);
		else {
			var start = changed.start;
			
			start += this.current.offsets[start];
			
			$(this.container.children[start]).after(newLines);
		}
	}
}

// http://jsfiddle.net/timdown/2YcaX/3/
Syntax.Editor.getCharacterOffset = function(range, node) {
	// Are \n being considered?
	var treeWalker = document.createTreeWalker(
		node,
		NodeFilter.SHOW_TEXT,
		function(node) {
			var nodeRange = document.createRange();
			nodeRange.selectNode(node);
			return nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1 ?
				NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
		},
		false
	);
	
	var charCount = 0;
	while (treeWalker.nextNode()) {
		charCount += treeWalker.currentNode.length;
	}
	
	if (range.startContainer.nodeType == 3) {
		charCount += range.startOffset;
	}
	
	return charCount;
};

Syntax.Editor.getNodesForCharacterOffsets = function(offsets, node) {
	var treeWalker = document.createTreeWalker(
		node,
		NodeFilter.SHOW_TEXT,
		function(node) {
			return NodeFilter.FILTER_ACCEPT;
		},
		false
	);
	
	var nodes = [], charCount = 0, i = 0;
	while (i < offsets.length && treeWalker.nextNode()) {
		var end = charCount + treeWalker.currentNode.length;

		while (i < offsets.length && offsets[i] < end) {
			nodes.push([treeWalker.currentNode, charCount, end]);

			i += 1;
		}

		charCount = end;
	}
	
	return nodes;
};

Syntax.Editor.prototype.getClientState = function() {
	var state = {};
	
	var selection = window.getSelection();
	
	if (selection.rangeCount > 0)
		state.range = selection.getRangeAt(0);
	
	if (state.range) {
		state.startOffset = Syntax.Editor.getCharacterOffset(state.range, this.container);
	}
	
	return state;
};

Syntax.Editor.prototype.setClientState = function(state) {
	if (state.startOffset) {
		var nodes = Syntax.Editor.getNodesForCharacterOffsets([state.startOffset], this.container);
		
		var range = document.createRange();
		range.setStart(nodes[0][0], state.startOffset - nodes[0][1]);
		range.setEnd(nodes[0][0], state.startOffset - nodes[0][1]);
		
		var selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	}
};

Syntax.layouts.editor = function(options, code/*, container*/) {
	var container = jQuery('<div class="editor syntax highlighted" contentEditable="true">');
	
	// Setup the initial html for the layout
	code.children().each(function() {
		var line = document.createElement('div');
		line.className = "source " + this.className;
		
		line.appendChild(this);
		container.append(line);
	});
	
	var editor = new Syntax.Editor(container.get(0));
		
	var updateContainer = function(lineHint) {
		// Need to save cursor position/selection
		var clientState = editor.getClientState();
		var changed = editor.updateChangedLines();
		

		
		var text = editor.textForLines(changed.start, changed.end);
		console.log("textForLines", changed.start, changed.end, text);
		//console.log("Updating lines from", changed.start, "to", changed.end, "original end", changed.originalEnd);
		//console.log("Children length", editor.container.children.length, editor.lines.length);
		
		if (changed.start == changed.end) {
			editor.updateLines(changed, []);
		} else {
			// Lines have been added, update the highlighting.
			Syntax.highlightText(text, options, function(html) {
				var newLines = [];
			
				html.children().each(function() {
					var line = document.createElement('div');
					line.className = "source " + this.className;
				
					line.appendChild(this);
					newLines.push(line);
				});
			
				editor.updateLines(changed, newLines);
			
				// Restore cusor position/selection if possible
				editor.setClientState(clientState);
			});
		}
	};
	
	// 'blur keyup paste mouseup'
	container.bind('keyup', function(){
		updateContainer();
	});
	
	container.bind('paste', function(event){
		updateContainer();
	});
	
	container.bind('keydown', function(event){
		if (event.keyCode == 9) {
			event.preventDefault();
			document.execCommand('insertHTML', true, "    ");
		}
		// else if (event.keyCode == 13) {
		//	event.preventDefault();
		//	document.execCommand('insertHTML', true, "\n");
		//}
	});
	
	ED = editor;
	
	return jQuery('<div class="syntax-container">').append(container);
};
