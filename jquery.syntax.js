
if (!window.console) {
	if (console)
		window.console = console
	else {
		window.console = {
			log: function() { /* Yum */ },
			error: function() { alert("(jquery.syntax) Error: " + Array.prototype.splice.call(arguments, 0).join(" ")); }
		}
	}
}

if (typeof(window.console.profile) != 'function') {
	window.console.profile = function () {}
	window.console.profileEnd = function () {}
}

(function ($) {
	$.fn.syntax = function (options, callback) {
		if (typeof(options) == 'function') {
			callback = options
			options = {}
		}
		
		options.layout = options.layout || 'plain'
		
		this.each(function () {
			var container = $(this)
			var brushName = options.brush
			
			Syntax.brushes.get(brushName, function(brush) {
				container.addClass('syntax')
				
				var html = brush.process(container.text())
				
				Syntax.layouts.get(options.layout, function(layout) {
					html = layout(options, html, container)
					
					if (callback)
						html = callback(options, html, container) || html
					
					if (html && options.replace == true)
						container.replaceWith(html)
				})
			})
		})
	}
})(jQuery)

// A kludgy hack... why aren't these functions available by default..!?
RegExp.indexOf = function (match, index) {
	return match[0].indexOf(match[index]) + match.index
}

RegExp.escape = function (pattern) {
	return pattern.replace(/[-[\]{}()*+?.\\^$|,#\s]/g,"\\$&")
}

function ResourceLoader (loader) {
	this.loading = {}
	this.loader = loader
}

ResourceLoader.prototype._finish = function (name) {
	// When the script has been succesfully loaded, we expect the script
	// to register with this loader (i.e. this[name]).
	
	var resource = this[name], loading = this.loading[name]
	
	// Clear the loading list
	this.loading[name] = null
	
	if (!resource)
		window.console.log("Could not load resource named ", name)
	else {
		for (var i in loading) {
			loading[i](resource)
		}
	}
}

ResourceLoader.prototype.get = function (name, callback) {
	if (this[name])
		callback(this[name])
	else if (this.loading[name])
		this.loading[name].push(callback)
	else {
		this.loading[name] = [callback]
		
		var target = this
		this.loader(name, function() { target._finish(name) })
	}
}

Syntax = {
	root: './', aliases: {}, styles: {}, lib: {},
	
	brushes: new ResourceLoader(function(name, callback) {
		name = Syntax.aliases[name] || name
		
		Syntax.getResource('jquery.syntax.brush', name, callback)
	}),
	
	layouts: new ResourceLoader(function(name, callback) {
		Syntax.getResource('jquery.syntax.layout', name, callback)
	}), 
	
	getStyles: function (path) {
		var link = $('<link>')
		$("head").append(link)

		link.attr({
			rel: "stylesheet",
			type: "text/css",
			href: path
		})
	},
	
	getScript: function (path, callback) {
		$.ajax({
			async: 'true',
			type: "GET",
			url: path,
			success: function() {
				callback()
			},
			dataType: "script",
			cache: true
		})
	},
	
	getResource: function (prefix, name, callback) {
		var basename = prefix + "." + name
		
		if (this.styles[basename])
			this.getStyles(this.root + basename + '.css')
		
		Syntax.getScript(this.root + basename + '.js', callback)
	},
	
	register: function (name, callback) {
		brush = Syntax.brushes[name] = new Syntax.Brush()
		window.console.log("Registering brush", name, Syntax.brushes)

		brush.klass = name
		
		callback(brush)
	},
	
	alias: function (name, aliases) {
		for (var i in aliases)
			Syntax.aliases[aliases[i]] = name
	},
	
	getMatches: function (text, expr) {
		//window.console.log("getMatches: ", text, expr)
		
		var matches = []
		
		while((match = expr.pattern.exec(text)) != null) {
			if (expr.matches)
				matches = matches.concat(expr.matches(match, expr))
			else
				matches.push(new Syntax.Match(match.index, match[0].length, expr, match[0]))
		}
		
		return matches
	}
}

// Default layout
Syntax.layouts.plain = function (options, html, container) {
	return html
}

Syntax.singleMatchFunction = function(index, rule) {
	return function(token) {
		return new Syntax.Match(RegExp.indexOf(match, index), match[index].length, rule, match[index])
	}
}

Syntax.lib.cStyleComment = {pattern: /\/\*[\s\S]*?\*\//gm, klass: 'comment', children: null}
Syntax.lib.cppStyleComment = {pattern: /\/\/.*$/gm, klass: 'comment', children: null}
Syntax.lib.perlStyleComment = {pattern: /#.*$/gm, klass: 'comment', children: null}
Syntax.lib.cStyleFunction = {pattern: /([a-z_][a-z0-9_]+)\s*\(/gi, matches: Syntax.singleMatchFunction(1, {klass: 'function', children: null})}
Syntax.lib.rubyStyleFunction = {pattern: /\.([a-z_][a-z0-9_]+)/gi, matches: Syntax.singleMatchFunction(1, {klass: 'function', children: null})}
Syntax.lib.rubyStyleSymbol = {pattern: /:[\w]+/, klass: 'constant', children: null}

Syntax.Match = function (offset, length, expr, value) {
	this.offset = offset
	this.endOffset = offset + length
	this.length = length
	this.expression = expr
	this.value = value
	this.children = []
	
	// When a node is bisected, this points to the next part.
	this.next = null
}

Syntax.Match.sort = function (a,b) {
	var diff = a.offset - b.offset
	
	if (diff != 0)
		return diff
	else
		return b.length - a.length
}

Syntax.Match.prototype.contains = function (match) {
	return (this.offset <= match.offset) && (match.endOffset <= this.endOffset)
}

Syntax.Match.defaultReduceCallback = function (node, container) {
	// We avoid using jQuery in this function since it is incredibly performance sensitive.
	// Using jQuery $.fn.append() can reduce performance by as much as 1/3rd.
	if (typeof(node) == 'string') {
		// Replace tabs => 4 spaces
		node = node.replace(/\t/g, "    ")
		// &nbsp; characters
		node = node.replace(/ /g, "\u00a0")
		
		node = document.createTextNode(node)
	} else {
		node = node[0]
	}
	
	container[0].appendChild(node)
}

Syntax.Match.prototype.reduce = function (append) {
	var start = this.offset
	var container = $('<span>')
	
	append = append || Syntax.Match.defaultReduceCallback
	
	if (this.expression && this.expression.klass)
		container.addClass(this.expression.klass)
	
	for (var i in this.children) {
		//window.console.log(i, this.children[i], text)
		
		var child = this.children[i]
		var end = child.offset
		
		var text = this.value.substr(start - this.offset, end - start)
		
		append(text, container)
		append(child.reduce(append), container)
		
		start = child.endOffset
	}
	
	if (start == this.offset)
		append(this.value, container)
	else if (start < this.endOffset)
		append(this.value.substr(start - this.offset, this.endOffset - start), container)
	else if (start > this.endOffset)
		window.console.log("Start position", start, "exceeds length of value", this)
	
	return container
}

// This function is by far the biggest overal cost in terms of run-time. This is not because
// it is slow, but mostly because it is called many times. It already has as much of the logic
// folded into it (few function calls). I considered making it non-recursive, but after testing,
// I found that less than 64 out of 500 function calls recursed at all, so it wouldn't be worth
// it - it might even get slower.
Syntax.Match.prototype.insert = function (match) {
	// We have explicitly said: no children
	if (this.expression.children === null)
		return null
	
	if (this.expression.children) {
		// window.console.log(this.expression.children, match.expression.klass, $.inArray(match.expression.klass, this.expression.children))
		if ($.inArray(match.expression.klass, this.expression.children) == -1)
			return null
	}
	
	if (!this.contains(match))
		return null
	
	if (this.children.length > 0) {
		for (var i in this.children) {
			var child = this.children[i]
			
			if (match.offset < child.offset) {
				if (match.endOffset <= child.offset) {
					this.children.splice(i, 0, match)
					return this
				} else {
					window.console.log("Match " + match.toString() + " " + displacement + "  existing child: " + this.children[i].toString())
					return null
				}
			} else if (match.offset < child.endOffset) {
				if (match.endOffset <= child.endOffset) {
					// Recursive step
					return child.insert(match)
				} else {
					var parts = match.halfBisect(child.endOffset)
					child.insert(parts[0])
					match = parts[1]
				}
			} else {
				if (i == this.children.length-1) {
					this.children.splice(i+1, 0, match)
					return this
				}
			}
		}
		
		window.console.log("Could not find suitable placement", match)
		return null
	} else {
		this.children.push(match)
		return this
	}
}

// I would like to remove this function but this recursive function solves the problem very 
// Elegantly. It is slow, in that it has O(n^2) performance. However, typically the
// main bisect function makes this bearable, since it has O(n) performance, and this function
// is hardly ever called. It is mostly here for syntactical edge cases, to ensure that the
// algorithm works as expected. Eventually it may be removed when I think of a better
// algorithm.
Syntax.Match.prototype.halfBisect = function(offset) {
	if (offset > this.offset && offset < this.endOffset) {
		var lhs = new Syntax.Match(this.offset, offset - this.offset, this.expression)
		var rhs = new Syntax.Match(offset, this.endOffset - offset, this.expression)
		
		lhs.value = this.value.substr(0, lhs.length)
		lhs.next = rhs
		
		rhs.value = this.value.substr(lhs.length, rhs.length)
		
		var i = 0
		
		if (this.children) {
			for (; i < this.children.length; i += 1) {
				if (!lhs.insert(this.children[i]))
					break
			}
		
			// This will normally only happen once.
			for (; i < this.children.length; i += 1) {
				var bisection = this.children[i].halfBisect(offset)
			
				if (bisection) {
					lhs.insert(bisection[0])
					rhs.insert(bisection[1])
				} else {
					break
				}
			}
		
			for (; i < this.children.length; i += 1) {
				if (!rhs.insert(this.children[i]))
					break
			}
		
			if (i != this.children.length)
				window.console.log("Did not bisect all children correctly:", this, "lhs", lhs, "rhs", rhs)
		}
		
		return [lhs, rhs]
	} else {
		return null
	}
}

Syntax.Match.prototype.bisectAtOffsets = function(splits) {
	var parts = [], start = this.offset, prev = null, children = $.merge([], this.children)
	
	for (var i in splits) {
		var offset = splits[i]
		
		if (offset < this.offset || offset > this.endOffset) {
			window.console.log("Offset", offset, "out of range!")
			break
		}
		
		var match = new Syntax.Match(start, offset - start, this.expression)
		match.value = this.value.substr(start, match.length)
		
		if (prev)
			prev.next = match
		
		prev = match
		
		while (children.length > 0) {
			if (children[0].endOffset <= match.endOffset)
				match.children.push(children.shift())
			else
				break
		}
		
		if (children.length) {
			
			var bisection = children[0].halfBisect(offset)
		
			if (bisection) {
				children.shift()
				
				match.children.push(bisection[0])
				children.unshift(bisection[1])
			}
		}
		
		start = match.endOffset
		parts.push(match)
	}
	
	if (children.length)
		window.console.log("Children not consumed!", children)
	
	return parts
}

Syntax.Match.prototype.split = function(pattern) {
	var splits = []
	
	while ((match = pattern.exec(this.value)) != null)
		splits.push(pattern.lastIndex)
	
	// We need to have a fake split at the end.
	splits.push(this.endOffset)
	
	return this.bisectAtOffsets(splits)
}

Syntax.Brush = function () {
	this.klass = null
	this.rules = []
}

Syntax.Brush.prototype.push = function () {
	if ($.isArray(arguments[0])) {
		var patterns = arguments[0], rule = arguments[1]
		
		for (var i in patterns)
			this.push($.extend({pattern: patterns[i]}, rule))
	} else {
		var rule = arguments[0]
		
		if (typeof(rule.pattern) == 'string') {
			rule.string = rule.pattern
			rule.pattern = new RegExp(RegExp.escape(rule.pattern), rule.options || 'g')
		}

		if (rule.pattern.global)
			this.rules.push(rule)
		else
			window.console.error("Only global regular expressions are acceptable as rules! ", rule)
	}
}

Syntax.Brush.prototype.getMatches = function(text) {
	var matches = []
	
	for (var i in this.rules) {
		matches = matches.concat(Syntax.getMatches(text, this.rules[i]))
	}
	
	return matches
}

Syntax.Brush.prototype.process = function(text) {
	var matches = this.getMatches(text), offset = 0
	var top = new Syntax.Match(0, text.length, {klass: this.klass}, text)
	
	// This sort is absolutely key to the functioning of the tree insertion algorithm.
	matches.sort(Syntax.Match.sort)
	
	for (var i in matches) {
		top.insert(matches[i])
	}
	
	var lines = top.split(/\n/g)
	
	var html = $('<pre>').addClass('syntax')
	
	for (var i in lines) {
		var line = lines[i].reduce()
		html.append(line)
	}
	
	return html
}
