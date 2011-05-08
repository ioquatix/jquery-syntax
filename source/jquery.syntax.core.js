//	This file is part of the "jQuery.Syntax" project, and is distributed under the MIT License.
//	Copyright (c) 2011 Samuel G. D. Williams. <http://www.oriontransfer.co.nz>
//	See <jquery.syntax.js> for licensing details.

if (!RegExp.prototype.indexOf) {
	RegExp.indexOf = function (match, index) {
		return match[0].indexOf(match[index]) + match.index;
	};
}

if (!RegExp.prototype.escape) {
	RegExp.escape = function (pattern) {
		return pattern.replace(/[\-\[\]{}()*+?.\\\^$|,#\s]/g, "\\$&");
	};
}

if (!String.prototype.repeat) {
	String.prototype.repeat = function(l) {
		return new Array(l+1).join(this);
	};
}

// The jQuery version of container.text() is broken on IE6.
// This version fixes it... for pre elements only. Other elements
// in IE will have the whitespace manipulated.
Syntax.getCDATA = function (elems) {
	var cdata = "", elem;
	
	(function (elems) {
		for (var i = 0; elems[i]; i++) {
			elem = elems[i];

			// Get the text from text nodes and CDATA nodes
			if (elem.nodeType === 3 || elem.nodeType === 4) {
				cdata += elem.nodeValue;
		
			// Use textContent || innerText for elements
			} else if (elem.nodeType === 1) {
				if (typeof(elem.textContent) === 'string')
					cdata += elem.textContent;
				else if (typeof(elem.innerText) === 'string')
					cdata += elem.innerText;
				else
					arguments.callee(elem.childNodes);
			
			// Traverse everything else, except comment nodes
			} else if (elem.nodeType !== 8) {
				arguments.callee(elem.childNodes);
			}
		}
	})(elems);
	
	return cdata.replace(/\r\n?/g, "\n");
}

// Convert to stack based implementation
Syntax.extractElementMatches = function (elems, offset, tabWidth) {
	var matches = [], current = [elems];
	offset = offset || 0;
	tabWidth = tabWidth || 4;
	
	(function (elems) {
		for (var i = 0; elems[i]; i++) {
			var text = null, elem = elems[i];
			
			if (elem.nodeType === 3 || elem.nodeType === 4) {
				offset += elem.nodeValue.length;
			
			} else if (elem.nodeType === 1) {
				var text = Syntax.getCDATA(elem.childNodes);
				var expr = {klass: elem.className, force: true, element: elem};
				
				matches.push(new Syntax.Match(offset, text.length, expr, text));
			}
			
			// Traverse everything, except comment nodes
			if (elem.nodeType !== 8) {
				arguments.callee(elem.childNodes, offset);
			}
		}
	})(elems);
	
	// Remove the top level element, since this will be recreated based on the supplied configuration.
	// Maybe there is a better way to achieve this?
	matches.shift();
	
	return matches;
}

Syntax.layouts.preformatted = function (options, html, container) {
	return html;
};

Syntax.modeLineOptions = {
	'tab-width': function(name, value, options) { options.tabWidth = parseInt(value, 10); }
};

Syntax.convertTabsToSpaces = function (text, tabSize) {
	var space = [], pattern = /\r|\n|\t/g, tabOffset = 0, offsets = [], totalOffset = 0;
	tabSize = tabSize || 4
	
	for (var i = ""; i.length <= tabSize; i = i + " ") {
		space.push(i);
	}

	text = text.replace(pattern, function(match) {
		var offset = arguments[arguments.length - 2];
		if (match === "\r" || match === "\n") {
			tabOffset = -(offset + 1);
			return match;
		} else {
			var width = tabSize - ((tabOffset + offset) % tabSize);
			tabOffset += width - 1;
			
			// Any match after this offset has been shifted right by totalOffset
			totalOffset += width - 1
			offsets.push([offset, width, totalOffset]);
			
			return space[width];
		}
	});
	
	return {text: text, offsets: offsets};
};

Syntax.convertToLinearOffsets = function (offsets, length) {
	var current = 0, changes = [];
	
	// Anything with offset after offset[current][0] but smaller than offset[current+1][0]
	// has been shifted right by offset[current][2]
	for (var i = 0; i < length; i++) {
		if (offsets[current] && i > offsets[current][0]) {
			if (offsets[current+1] && i <= offsets[current+1][0]) {
				changes.push(offsets[current][2]);
			} else {
				current += 1;
				i -= 1;
			}
		} else {
			changes.push(changes[changes.length-1] || 0);
		}
	}
	
	return changes;
}

Syntax.updateMatchesWithOffsets = function (matches, linearOffsets, text) {
	(function (matches) {
		for (var i = 0; i < matches.length; i++) {
			var match = matches[i];
			
			// Calculate the new start and end points
			var offset = match.offset + linearOffsets[match.offset];
			var end = match.offset + match.length;
			end += linearOffsets[end];
			
			// Start, Length, Text
			match.adjust(linearOffsets[match.offset], end - offset, text);
			
			if (match.children.length > 0)
				arguments.callee(match.children);
		}
	})(matches);
	
	return matches;
};

Syntax.extractMatches = function() {
	var rules = arguments;
	
	return function(match, expr) {
		var matches = [];
		
		for (var i = 0; i < rules.length; i += 1) {
			var rule = rules[i], index = i+1;
			
			if (rule == null) {
				continue;
			}
			
			if (typeof(rule.index) != 'undefined') {
				index = rule.index;
			}
			
			if (rule.debug) {
				Syntax.log("extractMatches", rule, index, match[index], match);
			}
			
			if (match[index].length > 0) {
				if (rule.brush) {
					matches.push(Syntax.brushes[rule.brush].buildTree(match[index], RegExp.indexOf(match, index)));
				} else {
					var expression = jQuery.extend({owner: expr.owner}, rule);
					
					matches.push(new Syntax.Match(RegExp.indexOf(match, index), match[index].length, expression, match[index]));
				}
			}
		}
		
		return matches;
	};
};

Syntax.lib.webLinkProcess = function (queryURI, lucky) {
	if (lucky) {
		queryURI = "http://www.google.com/search?btnI=I&q=" + encodeURIComponent(queryURI + " ");
	}
	
	return function (element, match) {
		return jQuery('<a>').
			attr('href', queryURI + encodeURIComponent(element.text())).
			attr('class', element.attr('class')).
			append(element.contents());
	};
};

Syntax.register = function (name, callback) {
	var brush = Syntax.brushes[name] = new Syntax.Brush();
	brush.klass = name;
	
	callback(brush);
};

Syntax.lib.cStyleComment = {pattern: /\/\*[\s\S]*?\*\//gm, klass: 'comment', allow: ['href']};
Syntax.lib.cppStyleComment = {pattern: /\/\/.*$/gm, klass: 'comment', allow: ['href']};
Syntax.lib.perlStyleComment = {pattern: /#.*$/gm, klass: 'comment', allow: ['href']};

Syntax.lib.perlStyleRegularExpressions = {pattern: /\B\/([^\/]|\\\/)*?\/[a-z]*(?=\s*[^\w\s'";\/])/g, klass: 'constant'};

Syntax.lib.cStyleFunction = {pattern: /([a-z_][a-z0-9_]*)\s*\(/gi, matches: Syntax.extractMatches({klass: 'function'})};
Syntax.lib.camelCaseType = {pattern: /\b_*[A-Z][\w]*\b/g, klass: 'type'};

Syntax.lib.xmlComment = {pattern: /(&lt;|<)!--[\s\S]*?--(&gt;|>)/gm, klass: 'comment'};
Syntax.lib.webLink = {pattern: /\w+:\/\/[\w\-.\/?%&=@:;#]*/g, klass: 'href'};

Syntax.lib.hexNumber = {pattern: /\b0x[0-9a-fA-F]+/g, klass: 'constant'};
Syntax.lib.decimalNumber = {pattern: /\b[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, klass: 'constant'};

Syntax.lib.doubleQuotedString = {pattern: /"([^\\"\n]|\\.)*"/g, klass: 'string'};
Syntax.lib.singleQuotedString = {pattern: /'([^\\'\n]|\\.)*'/g, klass: 'string'};
Syntax.lib.multiLineDoubleQuotedString = {pattern: /"([^\\"]|\\.)*"/g, klass: 'string'};
Syntax.lib.multiLineSingleQuotedString = {pattern: /'([^\\']|\\.)*'/g, klass: 'string'};
Syntax.lib.stringEscape = {pattern: /\\./g, klass: 'escape', only: ['string']};

Syntax.Match = function (offset, length, expression, value) {
	this.offset = offset;
	this.endOffset = offset + length;
	this.length = length;
	this.expression = expression;
	this.value = value;
	this.children = [];
	this.parent = null;
	
	// When a node is bisected, this points to the next part.
	this.next = null;
};

// Shifts an entire tree forward or backwards.
Syntax.Match.prototype.shift = function (offset, text) {
	this.adjust(offset, null, text);
	
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].shift(offset, text)
	}
};

// C the current match to have different offset and length.
Syntax.Match.prototype.adjust = function (offset, length, text) {
	this.offset += offset;
	this.endOffset += offset;
	
	if (length) {
		this.length = length;
		this.endOffset = this.offset + length;
	}
	
	if (text) {
		this.value = text.substr(this.offset, this.length);
	}
};

Syntax.Match.sort = function (a,b) {
	return (a.offset - b.offset) || (b.length - a.length);
};

Syntax.Match.prototype.contains = function (match) {
	return (match.offset >= this.offset) && (match.endOffset <= this.endOffset);
};

Syntax.Match.defaultReduceCallback = function (node, container) {
	// We avoid using jQuery in this function since it is incredibly performance sensitive.
	// Using jQuery jQuery.fn.append() can reduce performance by as much as 1/3rd.
	if (typeof(node) === 'string') {
		node = document.createTextNode(node);
	} else {
		node = node[0];
	}
	
	container[0].appendChild(node);
};

Syntax.Match.prototype.reduce = function (append, process) {
	var start = this.offset;
	var container = jQuery('<span></span>');
	
	append = append || Syntax.Match.defaultReduceCallback;
	
	if (this.expression && this.expression.klass) {
		container.addClass(this.expression.klass);
	}
	
	for (var i = 0; i < this.children.length; i += 1) {
		var child = this.children[i], end = child.offset;
		
		if (child.offset < this.offset) {
			Syntax.log("Syntax Warning: Offset of child", child, "is before offset of parent", this);
		}
		
		var text = this.value.substr(start - this.offset, end - start);
		
		append(text, container);
		append(child.reduce(append, process), container);
		
		start = child.endOffset;
	}
	
	if (start === this.offset) {
		append(this.value, container);
	} else if (start < this.endOffset) {
		append(this.value.substr(start - this.offset, this.endOffset - start), container);
	} else if (start > this.endOffset) {
		Syntax.log("Syntax Warning: Start position " + start + " exceeds end of value " + this.endOffset);
	}
	
	if (process) {
		container = process(container, this);
	}
	
	return container;
};

Syntax.Match.prototype.canContain = function (match) {
	// This is a special conditional for explicitly added ranges by the user.
	// Since user added it, we honour it no matter what.
	if (match.expression.force) {
		return true;
	}
	
	// Can't add anything into complete trees.
	if (this.complete) {
		return false;
	}
	
	// match.expression.only will be checked on insertion using this.canHaveChild(match)
	if (match.expression.only) {
		return true;
	}
	
	// If allow is undefined, default behaviour is no children.
	if (typeof(this.expression.allow) === 'undefined') {
		return false;
	}
	
	// false if {disallow: [..., klass, ...]}
	if (jQuery.isArray(this.expression.disallow) && jQuery.inArray(match.expression.klass, this.expression.disallow) !== -1) {
		return false;
	}
	
	// true if {allow: '*'}
	if (this.expression.allow === '*') {
		return true;
	}
	
	// true if {allow: [..., klass, ...]}
	if (jQuery.isArray(this.expression.allow) && jQuery.inArray(match.expression.klass, this.expression.allow) !== -1) {
		return true;
	}
	
	return false;
};

Syntax.Match.prototype.canHaveChild = function(match) {
	var only = match.expression.only;
	
	// This condition is fairly slow
	if (only) {
		var cur = this;
		
		while (cur !== null) {
			if (jQuery.inArray(cur.expression.klass, only) !== -1) {
				return true;
			}
			
			cur = cur.parent;
			
			// We don't traverse into other trees.
			if (cur && cur.complete) {
				break;
			}
		}
		
		return false;
	}
	
	return true;
};

Syntax.Match.prototype._splice = function(i, match) {
	if (this.canHaveChild(match)) {
		this.children.splice(i, 0, match);
		match.parent = this;
		
		// For matches added using tags.
		if (!match.expression.owner) {
			match.expression.owner = this.expression.owner;
		}
		
		return this;
	} else {
		return null;
	}
};

// This function implements a full insertion procedure, and will break up the match to fit.
// This operation is potentially very expensive, but is used to insert custom ranges into
// the tree, if they are specified by the user. A custom <span> may cover multiple leafs in
// the tree, thus naturally it needs to be broken up.
// You should avoid using this function except in very specific cases.
Syntax.Match.prototype.insert = function(match) {
	if (!this.contains(match))
		return null;
	
	return this._insert(match);
}

// This is not a general tree insertion function. It is optimised to run in almost constant
// time, but data must be inserted in sorted order, otherwise you will have problems.
// This function also ensures that matches won't be broken up unless absolutely necessary.
Syntax.Match.prototype.insertAtEnd = function (match) {
	if (!this.contains(match)) {
		Syntax.log("Syntax Error: Child is not contained in parent node!");
		return null;
	}
	
	if (!this.canContain(match)) {
		return null;
	}
	
	if (this.children.length > 0) {
		var i = this.children.length-1;
		var child = this.children[i];
		
		if (match.offset < child.offset) {
			// Displacement: Before or LHS Overlap
			// This means that the match has actually occurred before the last child.
			// This is a bit of an unusual situation because the matches SHOULD be in
			// sorted order.
			// However, we are sure that the match is contained in this node. This situation
			// sometimes occurs when sorting existing branches with matches that are supposed
			// to be within that branch. When we insert the match into the branch, there are
			// matches that technically should have been inserted afterwards.
			// Normal usage should avoid this case, and this is best for performance.
			if (match.force) {
				return this._insert(match);
			} else {
				return null;
			}
		} else if (match.offset < child.endOffset) {
			if (match.endOffset <= child.endOffset) { 
				// Displacement: Contains
				//console.log("displacement => contains");
				var result = child.insertAtEnd(match);
				return result;
			} else {
				// Displacement: RHS Overlap
				if (match.force) {
					return this._insert(match);
				} else {
					return null;
				}
			}
		} else {
			// Displacement: After
			return this._splice(i+1, match);
		}
		
		// Could not find a suitable placement: this is probably an error.
		return null;
	} else {
		// Displacement: Contains [but currently no children]
		return this._splice(0, match);
	}
};

// This insertion function is relatively complex because it is required to split the match over
// several children.
Syntax.Match.prototype._insert = function(match) {
	if (this.children.length == 0)
		return this._splice(0, match);
	
	for (var i = 0; i < this.children.length; i += 1) {
		var child = this.children[i];
		
		// If the match ends before this child, it must be before it.
		if (match.endOffset <= child.offset)
			return this._splice(i, match);
		
		// If the match starts after this child, we continue.
		if (match.offset >= child.endOffset)
			continue;
		
		// There are four possibilities... 
		// ... with the possibility of overlapping children on the RHS.
		//           {------child------}   {---possibly some other child---}
		//   |----------complete overlap---------|
		//   |--lhs overlap--|
		//             |--contains--|
		//                       |--rhs overlap--|
		
		// First, the easiest case:
		if (child.contains(match)) {
			return child._insert(match);
		}
		
		console.log("Bisect at offsets", match, child.offset, child.endOffset);
		var parts = match.bisectAtOffsets([child.offset, child.endOffset]);
		console.log("parts =", parts);
		// We now have at most three parts
		//           {------child------}   {---possibly some other child---}
		//   |--[0]--|-------[1]-------|--[2]--|
		
		// console.log("parts", parts);
		
		if (parts[0]) {
			this._splice(i, parts[0])
		}
		
		if (parts[1]) {
			child.insert(parts[1])
		}
		
		// Continue insertion at this level with remainder.
		if (parts[2]) {
			match = parts[2]
		} else {
			return this;
		}
	}
	
	// If we got this far, the match wasn't [completely] inserted into the list of existing children, so it must be on the end.
	this._splice(this.children.length, match);
}

// This algorithm recursively bisects the tree at a given offset, but it does this efficiently by folding multiple bisections
// at a time.
// Splits:            /                /                   /
// Tree:       |-------------------------Top-------------------------|
//             |------------A--------------------|  |------C-------|
//                         |-------B----------|
// Step (1):
// Split Top into 4 parts:
//             |------/----------------/-------------------/---------|
// For each part, check if there are any children that cover this part.
// If there is a child, recursively call bisect with all splits.
// Step (1-1):
// Split A into parts:
//             |------/-----A----------/---------|
// For each part, check if there are any children that cover this part.
// If there is a child, recursively call bisect with all splits.
// Step (1-1-1):
// Split B into parts:
//                         |-------B---/------|
// No children covered by split. Return array of two parts, B1, B2.
// Step (1-2):
// Enumerate the results of splitting the child and merge piece-wise into own parts
//             |------/-----A----------/---------|
//                         |------B1---|--B2--|
// Finished merging children, return array of three parts, A1, A2, A3
// Step (2):
// Enumerate the results of splitting the child and merge piece-wise into own parts.
//             |------/----------------/-------------------/---------|
//             |--A1--|-------A2-------|----A3---|
//                         |------B1---|--B2--|
// Continue by splitting next child, C.
// Once all children have been split and merged, return all parts, T1, T2, T3, T4.
// The new tree:
//             |--T1--|-------T2-------|--------T3---------|---T4---|
//             |--A1--|-------A2-------|----A3---|  |--C1--|---C2--|
//                         |------B1---|--B2--|
//
// The new structure is as follows:
//		T1 <-	A1
//		T2 <-	A2	<- B1
//		T3 <-	A3	<-	B2
//		   \-	C1
//		T4 <- C2
//
Syntax.Match.prototype.bisectAtOffsets = function(splits) {
	var parts = [], start = this.offset, prev = null, children = jQuery.merge([], this.children);
	
	// Copy the array so we can modify it.
	splits = splits.slice(0);
	
	// We need to split including the last part.
	splits.push(this.endOffset);
	
	splits.sort(function (a,b) {
		return a-b;
	});
	
	// We build a set of top level matches by looking at each split point and
	// creating a new match from the end of the previous match to the split point.
	for (var i = 0; i < splits.length; i += 1) {
		var offset = splits[i];
		
		// The split offset is past the end of the match, so there are no more possible
		// splits.
		if (offset > this.endOffset) {
			break;
		}
		
		// We keep track of null parts if the offset is less than the start
		// so that things align up as expected with the requested splits.
		if (
			offset < this.offset // If the split point is less than the start of the match.
			|| (offset - start) == 0 // If the match would have effectively zero length.
		) {
			parts.push(null); // Preserve alignment with splits.
			start = offset;
			continue;
		}
		
		// Even if the previous split was out to the left, we align up the start
		// to be at the start of the match we are bisecting.
		if (start < this.offset)
			start = this.offset;
		
		var match = new Syntax.Match(start, offset - start, this.expression);
		match.value = this.value.substr(start - this.offset, match.length);
		
		if (prev) {
			prev.next = match;
		}
		
		prev = match;
		
		start = match.endOffset;
		parts.push(match);
	}
	
	// We only need to split to produce the number of parts we have.
	splits.length = parts.length;
	
	for (var i = 0; i < parts.length; i += 1) {
		if (parts[i] == null)
			continue;
		
		var offset = splits[0];
		
		while (children.length > 0) {
			if (children[0].endOffset <= parts[i].endOffset) {
				parts[i].children.push(children.shift());
			} else {
				break;
			}
		}
		
		if (children.length) {
			// We may have an intersection
			if (children[0].offset < parts[i].endOffset) {
				var children_parts = children.shift().bisectAtOffsets(splits), j = 0;
			
				// children_parts are the bisected children which need to be merged with parts
				// in a linear fashion
				for (; j < children_parts.length; j += 1) {
					if (children_parts[j] == null) continue; // Preserve alignment with splits.
					
					parts[i+j].children.push(children_parts[j]);
				}
				
				// Skip any parts which have been populated already
				// (i is incremented at the start of the loop, splits shifted at the end)
				i += (children_parts.length-2);
				splits.splice(0, children_parts.length-2);
			}
		}
		
		splits.shift();
	}
	
	if (children.length) {
		Syntax.log("Syntax Error: Children nodes not consumed", children.length, " remaining!");
	}
	
	return parts;
};

Syntax.Match.prototype.split = function(pattern) {
	var splits = [], match;
	
	while ((match = pattern.exec(this.value)) !== null) {
		splits.push(pattern.lastIndex);
	}
	
	var matches = this.bisectAtOffsets(splits);
	
	// Remove any null placeholders.
	return jQuery.grep(matches, function(n,i){
		return n;
	});
};

Syntax.Brush = function () {
	// The primary class of this brush. Must be unique.
	this.klass = null;
	
	// A sequential list of rules for extracting matches.
	this.rules = [];
	
	// A list of all parents that this brush derives from.
	this.parents = [];
	
	// A list of processes that may be run after extracting matches.
	this.processes = {};
};

Syntax.Brush.convertStringToTokenPattern = function (pattern, escape) {
	var prefix = "\\b", postfix = "\\b";
	
	if (!pattern.match(/^\w/)) {
		if (!pattern.match(/\w$/)) {
			prefix = postfix = "";
		} else {
			prefix = "\\B";
		}
	} else {
		if (!pattern.match(/\w$/)) {
			postfix = "\\B";
		}
	}
	
	if (escape)
		pattern = RegExp.escape(pattern)
	
	return prefix + pattern + postfix;
}

// Add a parent to the brush. This brush should be loaded as a dependency.
Syntax.Brush.prototype.derives = function (name) {
	this.parents.push(name);
	this.rules.push({
		apply: function(text, expr, offset) {
			return Syntax.brushes[name].getMatches(text, offset);
		}
	});
}

// Return an array of all classes that the brush consists of.
// A derivied brush is its own klass + the klass of any and all parents.
Syntax.Brush.prototype.allKlasses = function () {
	var klasses = [this.klass];
	
	for (var i = 0; i < this.parents.length; i += 1) {
		klasses = klasses.concat(Syntax.brushes[this.parents[i]].allKlasses());
	}
	
	return klasses;
}

Syntax.Brush.prototype.push = function () {
	if (jQuery.isArray(arguments[0])) {
		var patterns = arguments[0], rule = arguments[1];
		
		for (var i = 0; i < patterns.length; i += 1) {
			this.push(jQuery.extend({pattern: patterns[i]}, rule));
		}
	} else {
		var rule = arguments[0];
		
		if (typeof(rule.pattern) === 'string') {
			rule.string = rule.pattern;
			rule.pattern = new RegExp(Syntax.Brush.convertStringToTokenPattern(rule.string, true), rule.options || 'g')
		}

		if (typeof(XRegExp) !== 'undefined') {
			rule.pattern = new XRegExp(rule.pattern);
		}

		if (rule.pattern && rule.pattern.global) {
			this.rules.push(jQuery.extend({owner: this}, rule));
		} else if (typeof(console) != "undefined") {
			Syntax.log("Syntax Error: Malformed rule: ", rule);
		}
	}
};

Syntax.Brush.prototype.getMatchesForRule = function (text, rule, offset) {
	var matches = [], match = null;
	
	// Short circuit (user defined) function:
	if (typeof rule.apply != "undefined") {
		return rule.apply(text, rule, offset);
	}
	
	// Duplicate the pattern so that the function is reentrant.
	var pattern = new RegExp;
	pattern.compile(rule.pattern);
	
	while((match = pattern.exec(text)) !== null) {
		if (rule.matches) {
			matches = matches.concat(rule.matches(match, rule));
		} else if (rule.brush) {
			matches.push(Syntax.brushes[rule.brush].buildTree(match[0], match.index));
		} else {
			matches.push(new Syntax.Match(match.index, match[0].length, rule, match[0]));
		}
	}
	
	if (offset && offset > 0) {
		for (var i = 0; i < matches.length; i += 1) {
			matches[i].shift(offset);
		}
	}
	
	if (rule.debug) {
		Syntax.log("matches", matches);
	}
	
	return matches;
};

Syntax.Brush.prototype.getMatches = function(text, offset) {
	var matches = [];
	
	for (var i = 0; i < this.rules.length; i += 1) {
		matches = matches.concat(this.getMatchesForRule(text, this.rules[i], offset));
	}
	
	return matches;
};

Syntax.Brush.prototype.buildTree = function(text, offset, additionalMatches) {
	offset = offset || 0;
	
	// Fixes code that uses \r\n for line endings. /$/ matches both \r\n, which is a problem..
	text = text.replace(/\r/g, "");
	
	var matches = this.getMatches(text, offset);
	
	var top = new Syntax.Match(offset, text.length, {klass: this.allKlasses().join(" "), allow: '*', owner: this}, text);

	// This sort is absolutely key to the functioning of the tree insertion algorithm.
	matches.sort(Syntax.Match.sort);

	for (var i = 0; i < matches.length; i += 1) {
		top.insertAtEnd(matches[i]);
	}
	
	if (additionalMatches) {
		for (var i = 0; i < additionalMatches.length; i += 1) {
			top.insert(additionalMatches[i], true);
		}
	}
	
	top.complete = true;
	
	return top;
};

// Matches is optional, and provides a set of pre-existing matches.
Syntax.Brush.prototype.process = function(text, matches) {
	var top = this.buildTree(text, 0, matches);
	
	var lines = top.split(/\n/g);
	
	var html = jQuery('<pre class="syntax"></pre>');
	
	for (var i = 0; i < lines.length; i += 1) {
		var line = lines[i].reduce(null, function (container, match) {
			if (match.expression) {
				if (match.expression.process) {
					container = match.expression.process(container, match);
				}
				
				var process = match.expression.owner.processes[match.expression.klass];
				if (process) {
					container = process(container, match);
				}
			}
			return container;
		});
		
		html.append(line);
	}
	
	return html;
};

Syntax.highlight = function (elements, options, callback) {
	if (typeof(options) === 'function') {
		callback = options;
		options = {};
	}
	
	options.layout = options.layout || 'preformatted';
	
	if (typeof(options.tabWidth) === 'undefined') {
		options.tabWidth = 4;
	}
	
	elements.each(function () {
		var container = jQuery(this);
		
		// We can augment the plain text to extract existing annotations.
		var matches = Syntax.extractElementMatches(container);
		var text = Syntax.getCDATA(container);
		
		var match = text.match(/-\*- mode: (.+?);(.*?)-\*-/i);
		var endOfSecondLine = text.indexOf("\n", text.indexOf("\n") + 1);
		
		if (match && match.index < endOfSecondLine) {
			options.brush = options.brush || match[1];
			var modeline = match[2];
			
			var mode = /([a-z\-]+)\:(.*?)\;/gi;
			
			while((match = mode.exec(modeline)) !== null) {
				var setter = Syntax.modeLineOptions[match[1]];
				
				if (setter) {
					setter(match[1], match[2], options);
				}
			}
		}
		
		var brushName = (options.brush || 'plain').toLowerCase();
		
		brushName = Syntax.aliases[brushName] || brushName;
		
		Syntax.brushes.get(brushName, function(brush) {
			if (options.tabWidth) {
				// Calculate the tab expansion and offsets
				replacement = Syntax.convertTabsToSpaces(text, options.tabWidth);
				
				// Update any existing matches
				if (matches && matches.length) {
					var linearOffsets = Syntax.convertToLinearOffsets(replacement.offsets, text.length);
					matches = Syntax.updateMatchesWithOffsets(matches, linearOffsets, replacement.text);
				}
				
				text = replacement.text;
			}
			
			var html = brush.process(text, matches);
			
			if (options.linkify !== false) {
				jQuery('span.href', html).each(function(){
					jQuery(this).replaceWith(jQuery('<a>').attr('href', this.innerHTML).text(this.innerHTML));
				});
			}
			
			Syntax.layouts.get(options.layout, function(layout) {
				html = layout(options, html, container);

				if (brush.postprocess) {
					html = brush.postprocess(options, html, container);
				}

				if (callback) {
					html = callback(options, html, container);
				}

				if (html && options.replace === true) {
					container.replaceWith(html);
				}
			});
		});
	});
};

// Register the file as being loaded
Syntax.loader.core = true;
