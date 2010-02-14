/* 
	This file is part of the "jQuery.Syntax" project, and is licensed under the GNU AGPLv3.

	Copyright 2010 Samuel Williams. All rights reserved.

	For more information, please see http://www.oriontransfer.co.nz/software/jquery-syntax

	This program is free software: you can redistribute it and/or modify it under the terms
	of the GNU Affero General Public License as published by the Free Software Foundation,
	either version 3 of the License, or (at your option) any later version.

	This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
	without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
	See the GNU General Public License for more details.

	You should have received a copy of the GNU Affero General Public License along with this
	program. If not, see <http://www.gnu.org/licenses/>.
*/

// A kludgy hack... why aren't these functions available by default..!?
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

// ECMAScript 5! Why wasn't this done before!?
if (!Function.prototype.bind) {
	Function.prototype.bind = function(target) {
		var args = [], fn = this;

		for (var n = 1; n < arguments.length; n += 1) {
			args.push(arguments[n]);
		}

		return function () { return fn.apply(target, args); };
	};
}

function ResourceLoader (loader) {
	this.dependencies = {};
	this.loading = {};
	this.loader = loader;
}

ResourceLoader.prototype._finish = function (name) {
	var deps = this.dependencies[name];
	
	if (deps) {
		// I'm not sure if this makes me want to cry... or laugh... or kill!?
		var chain = this._loaded.bind(this, name);
		
		for (var i = 0; i < deps.length; i += 1) {
			chain = this.get.bind(this, deps[i], chain);
		}
		
		chain();
	} else {
		this._loaded(name);
	}
};

ResourceLoader.prototype._loaded = function (name) {
	// When the script has been succesfully loaded, we expect the script
	// to register with this loader (i.e. this[name]).
	var resource = this[name], loading = this.loading[name];

	// Clear the loading list
	this.loading[name] = null;

	if (!resource) {
		alert("Could not load resource named ", name);
	} else {
		for (var i = 0; i < loading.length; i += 1) {
			loading[i](resource);
		}
	}
};

ResourceLoader.prototype.dependency = function(current, next) {
	 // if it is already loaded, it isn't a dependency
	if (this[next]) {
		return;
	}
	
	if (this.dependencies[current]) {
		this.dependencies[current].push(next);
	} else {
		this.dependencies[current] = [next];
	}
	
	// Possible preload step... need to test!
	// this.get(next, bindTargetArguments(this, this._finish, next))
};

ResourceLoader.prototype.get = function (name, callback) {
	if (this[name]) {
		callback(this[name]);
	} else if (this.loading[name]) {
		this.loading[name].push(callback);
	} else {
		this.loading[name] = [callback];
		
		this.loader(name, this._finish.bind(this, name));
	}
};

var Syntax = {
	root: './', aliases: {}, styles: {}, lib: {},
	
	brushes: new ResourceLoader(function(name, callback) {
		name = Syntax.aliases[name] || name;
		
		Syntax.getResource('jquery.syntax.brush', name, callback);
	}),
	
	layouts: new ResourceLoader(function(name, callback) {
		Syntax.getResource('jquery.syntax.layout', name, callback);
	}),
	
	getStyles: function (path) {
		var link = $('<link>');
		$("head").append(link);

		link.attr({
			rel: "stylesheet",
			type: "text/css",
			href: path
		});
	},
	
	getScript: function (path, callback) {
		$.ajax({
			async: 'true',
			type: "GET",
			url: path,
			success: function() {
				callback();
			},
			dataType: "script",
			cache: true
		});
	},
	
	getResource: function (prefix, name, callback) {
		var basename = prefix + "." + name;
		
		if (this.styles[basename]) {
			this.getStyles(this.root + basename + '.css');
		}
		
		Syntax.getScript(this.root + basename + '.js', callback);
	},
	
	register: function (name, callback) {
		var brush = Syntax.brushes[name] = new Syntax.Brush();
		brush.klass = name;
		
		callback(brush);
	},
	
	alias: function (name, aliases) {
		for (var i = 0; i < aliases.length; i += 1) {
			Syntax.aliases[aliases[i]] = name;
		}
	},
	
	getMatches: function (text, expr, offset) {
		var matches = [], match = null;
		
		while((match = expr.pattern.exec(text)) !== null) {
			if (expr.matches) {
				matches = matches.concat(expr.matches(match, expr));
			} else {
				matches.push(new Syntax.Match(match.index, match[0].length, expr, match[0]));
			}
		}
		
		if (offset && offset > 0) {
			for (var i = 0; i < matches.length; i += 1) {
				matches[i].shift(offset);
			}
		}
		
		return matches;
	},
	
	convertTabsToSpaces: function (text, tabSize) {
		var space = [], pattern = /(\r|\n|\t)/g, tabOffset = 0;
		
		for (var i = ""; i.length <= tabSize; i = i + " ") {
			space.push(i);
		}

		text = text.replace(pattern, function(match) {
			var offset = arguments[arguments.length - 2];
			if (match[0] === "\r" || match[0] === "\n") {
				tabOffset = -(offset + 1);
				return match[0];
			} else {
				var width = tabSize - ((tabOffset + offset) % tabSize);
				tabOffset += width - 1;
				return space[width];
			}
		});
		
		return text;
	},
	
	modeLineOptions: {
		'tab-width': function(name, value, options) { options.tabWidth = parseInt(value, 10); }
	}
};

(function ($) {
	$.fn.syntax = function (options, callback) {
		if (typeof(options) === 'function') {
			callback = options;
			options = {};
		}
		
		options.layout = options.layout || 'plain';
		
		if (typeof(options.tabWidth) === 'undefined') {
			options.tabWidth = 4;
		}
		
		this.each(function () {
			var container = $(this);
			
			var text = container.text();

			var match = text.match(/-\*- mode: (.+?);(.*?)-\*-/i);
			var endOfSecondLine = text.indexOf("\n", text.indexOf("\n") + 1);
			
			if (match && match.index < endOfSecondLine) {
				options.brush = match[1].toLowerCase();
				var modeline = match[2];
				
				var mode = /([a-z\-]+)\:(.*?)\;/gi;
				
				while((match = mode.exec(modeline)) !== null) {
					var setter = Syntax.modeLineOptions[match[1]];
					
					if (setter) {
						setter(match[1], match[2], options);
					}
				}
			}
			
			var brushName = options.brush || 'plain';
			
			Syntax.brushes.get(brushName, function(brush) {
				container.addClass('syntax');
				
				if (options.tabWidth) {
					text = Syntax.convertTabsToSpaces(text, options.tabWidth);
				}
				
				var html = brush.process(text);
				
				Syntax.layouts.get(options.layout, function(layout) {
					html = layout(options, html, container);
					
					if (callback) {
						html = callback(options, html, container) || html;
					}
					
					if (html && options.replace === true) {
						container.replaceWith(html);
					}
				});
			});
		});
	};
	
	$.syntax = function (options, callback) {
		// Some useful defaults
		var selector = (options.selector || 'pre.syntax');
		
		if (typeof(options.replace) === 'undefined') {
			options.replace = true;
		}
		
		if (typeof(options.layout) === 'undefined'){
			options.layout = 'table';
		}
		
		$(selector).each(function(){
			var match = this.className.match(/brush-([\w\-]+)/);
			var brush;
			
			if (match) {
				brush = match[1];
			}
			
			$(this).syntax($.extend({brush: brush}, options), callback);
		});
	};
}(jQuery));

Syntax.layouts.plain = function (options, html, container) {
	return html;
};

Syntax.singleMatchFunction = function(index, rule) {
	return function(match) {
		return new Syntax.Match(RegExp.indexOf(match, index), match[index].length, rule, match[index]);
	};
};

Syntax.parseScriptFunction = function(brush, index) {
	return function(match) {
		return Syntax.brushes[brush].buildTree(match[index], RegExp.indexOf(match, index));
	};
};

Syntax.lib.cStyleComment = {pattern: /\/\*[\s\S]*?\*\//gm, klass: 'comment', allow: ['href']};
Syntax.lib.cppStyleComment = {pattern: /\/\/.*$/gm, klass: 'comment', allow: ['href']};
Syntax.lib.perlStyleComment = {pattern: /#.*$/gm, klass: 'comment', allow: ['href']};

Syntax.lib.cStyleFunction = {pattern: /([a-z_][a-z0-9_]+)\s*\(/gi, matches: Syntax.singleMatchFunction(1, {klass: 'function', allow: []})};

Syntax.lib.xmlComment = {pattern: /(&lt;|<)!--[\s\S]*?--(&gt;|>)/gm, klass: 'comment'};
Syntax.lib.webLink = {pattern: /\w+:\/\/[\w\-.\/?%&=@:;#]*/g, klass: 'href'};

Syntax.lib.doubleQuotedString = {pattern: /"([^\\"\n]|\\.)*"/g, klass: 'string', allow: []};
Syntax.lib.singleQuotedString = {pattern: /'([^\\'\n]|\\.)*'/g, klass: 'string', allow: []};
Syntax.lib.multiLineDoubleQuotedString = {pattern: /"([^\\"]|\\.)*"/g, klass: 'string', allow: []};
Syntax.lib.multiLineSingleQuotedString = {pattern: /'([^\\']|\\.)*'/g, klass: 'string', allow: []};
Syntax.lib.stringEscape = {pattern: /\\./g, klass: 'escape', only: ['string']};

Syntax.Match = function (offset, length, expr, value) {
	this.offset = offset;
	this.endOffset = offset + length;
	this.length = length;
	this.expression = expr;
	this.value = value;
	this.children = [];
	this.parent = null;
	
	// When a node is bisected, this points to the next part.
	this.next = null;
};

Syntax.Match.prototype.shift = function (x) {
	this.offset += x;
	this.endOffset += x;
};

Syntax.Match.sort = function (a,b) {
	return (a.offset - b.offset) || (b.length - a.length);
};

Syntax.Match.prototype.contains = function (match) {
	return (match.offset >= this.offset) && (match.endOffset <= this.endOffset);
};

Syntax.Match.defaultReduceCallback = function (node, container) {
	// We avoid using jQuery in this function since it is incredibly performance sensitive.
	// Using jQuery $.fn.append() can reduce performance by as much as 1/3rd.
	if (typeof(node) === 'string') {
		// &nbsp; characters
		node = node.replace(/[ ]{2}/g, "\u00a0\u00a0");
		
		node = document.createTextNode(node);
	} else {
		node = node[0];
	}
	
	container[0].appendChild(node);
};

Syntax.Match.prototype.reduce = function (append) {
	var start = this.offset;
	var container = $('<span>');
	
	append = append || Syntax.Match.defaultReduceCallback;
	
	if (this.expression && this.expression.klass) {
		container.addClass(this.expression.klass);
	}
	
	for (var i = 0; i < this.children.length; i += 1) {
		var child = this.children[i], end = child.offset;
		var text = this.value.substr(start - this.offset, end - start);
		
		append(text, container);
		append(child.reduce(append), container);
		
		start = child.endOffset;
	}
	
	if (start === this.offset) {
		append(this.value, container);
	} else if (start < this.endOffset) {
		append(this.value.substr(start - this.offset, this.endOffset - start), container);
	} else if (start > this.endOffset) {
		alert("Syntax Warning: Start position " + start + " exceeds end of value " + this.endOffset);
	}
	
	return container;
};

Syntax.Match.prototype.canContain = function (match) {
	if (this.complete) {
		return false;
	}
	
	// The match will be checked on insertion using this.canHaveChild(match)
	if (match.expression.only) {
		return true;
	}
	
	if (this.expression.disallow && $.inArray(match.expression.klass, this.expression.disallow) !== -1) {
		return false;
	}
	
	if (this.expression.allow && $.inArray(match.expression.klass, this.expression.allow) !== -1) {
		return true;
	}
	
	if (this.expression.allow) {
		return false;
	} else {
		return true;
	}
};

Syntax.Match.prototype.canHaveChild = function (match) {
	// This condition is fairly slow
	if (match.expression.only) {
		var cur = this;
		
		while (cur !== null) {
			if ($.inArray(cur.expression.klass, match.expression.only) !== -1) {
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
		return this;
	} else {
		return null;
	}
};

// This is not a general tree insertion function. It is optimised to run in almost constant
// time, but data must be inserted in sorted order, otherwise you will have problems.
Syntax.Match.prototype.insertAtEnd = function (match) {
	if (!this.contains(match)) {
		alert("Syntax Error: Child is not contained in parent node!");
		return null;
	}
	
	if (!this.canContain(match)) {
		return null;
	}
	
	if (this.children.length > 0) {
		var i = this.children.length-1;
		var child = this.children[i];
		
		if (match.offset < child.offset) {
			if (match.endOffset <= child.offset) {
				// displacement = 'before'
				return this._splice(i, match);
			} else {
				// displacement = 'left-overlap'
				return null;
			}
		} else if (match.offset < child.endOffset) {
			if (match.endOffset <= child.endOffset) {
				// displacement = 'contains'
				var result = child.insertAtEnd(match);
				return result;
			} else {
				// displacement = 'right-overlap'
				// If a match overlaps a previous one, we ignore it.
				return null;
			}
		} else {
			// displacement = 'after'
			return this._splice(i+1, match);
		}
		
		// Could not find a suitable placement
		return null;
	} else {
		return this._splice(0, match);
	}
};

Syntax.Match.prototype.halfBisect = function(offset) {
	if (offset > this.offset && offset < this.endOffset) {
		return this.bisectAtOffsets([offset, this.endOffset]);
	} else {
		return null;
	}
};

Syntax.Match.prototype.bisectAtOffsets = function(splits) {
	var parts = [], start = this.offset, prev = null, children = $.merge([], this.children);
	
	// Copy the array so we can modify it.
	splits = splits.slice(0);
	
	// We need to split including the last part.
	splits.push(this.endOffset);
	splits.sort(function(a,b){return a-b;});
	
	for (var i = 0; i < splits.length; i += 1) {
		var offset = splits[i];
		
		if (offset < this.offset || offset > this.endOffset) {
			break;
		}
		
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
			
				for (; j < children_parts.length; j += 1) {
					parts[i+j].children.push(children_parts[j]);
				}
				
				// Skip any parts which have been populated already
				// i += (children_parts.length-1)
			}
		}
		
		splits.shift();
	}
	
	if (children.length) {
		alert("Syntax Error: Children nodes not consumed, " + children.lenght + " remaining!");
	}
	
	return parts;
};

Syntax.Match.prototype.split = function(pattern) {
	var splits = [], match;
	
	while ((match = pattern.exec(this.value)) !== null) {
		splits.push(pattern.lastIndex);
	}
	
	return this.bisectAtOffsets(splits);
};

Syntax.Brush = function () {
	this.klass = null;
	this.rules = [];
};

Syntax.Brush.prototype.push = function () {
	if ($.isArray(arguments[0])) {
		var patterns = arguments[0], rule = arguments[1];
		
		for (var i = 0; i < patterns.length; i += 1) {
			this.push($.extend({pattern: patterns[i]}, rule));
		}
	} else {
		var rule = arguments[0];
		
		if (typeof(rule.pattern) === 'string') {
			rule.string = rule.pattern;
			var prefix = "\\b", postfix = "\\b";
			
			if (!rule.pattern.match(/^\w/)) {
				if (!rule.pattern.match(/\w$/)) {
					prefix = postfix = "";
				} else {
					prefix = "\\B";
				}
			} else {
				if (!rule.pattern.match(/\w$/)) {
					postfix = "\\B";
				}
			}
			
			
			rule.pattern = rule.pattern = new RegExp(prefix + RegExp.escape(rule.pattern) + postfix, rule.options || 'g');
		}

		if (rule.pattern.global) {
			this.rules.push(rule);
		} else {
			alert("Syntax Error: Malformed rule! All rules need to be global! " + rule);
		}
	}
};

Syntax.Brush.prototype.getMatches = function(text, offset) {
	var matches = [];
	
	for (var i = 0; i < this.rules.length; i += 1) {
		matches = matches.concat(Syntax.getMatches(text, this.rules[i], offset));
	}
	
	return matches;
};

Syntax.Brush.prototype.buildTree = function(text, offset) {
	offset = offset || 0;
	
	var matches = this.getMatches(text, offset);
	var top = new Syntax.Match(offset, text.length, {klass: this.klass}, text);

	// This sort is absolutely key to the functioning of the tree insertion algorithm.
	matches.sort(Syntax.Match.sort);

	for (var i = 0; i < matches.length; i += 1) {
		top.insertAtEnd(matches[i]);
	}
	
	top.complete = true;
	
	return top;
};

Syntax.Brush.prototype.process = function(text) {
	var top = this.buildTree(text);
	
	var lines = top.split(/\n/g);
	
	var html = $('<pre>').addClass('syntax');
	
	for (var i = 0; i < lines.length; i += 1) {
		var line = lines[i].reduce();
		html.append(line);
	}
	
	return html;
};
