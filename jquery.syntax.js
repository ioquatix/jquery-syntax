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
		alert("Could not load resource named " + name);
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
	
	loader: new ResourceLoader(function(name, callback) {
		Syntax.getResource('jquery.syntax', name, callback)
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
			async: false,
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
			this.getStyles(this.root + this.styles[basename]);
		}
		
		Syntax.getScript(this.root + basename + '.js', callback);
	},
	
	alias: function (name, aliases) {
		for (var i = 0; i < aliases.length; i += 1) {
			Syntax.aliases[aliases[i]] = name;
		}
	}
};

(function ($) {
	$.fn.syntax = function (options, callback) {
		var elements = this;
		
		Syntax.loader.get('core', function() {
			Syntax.highlight(elements, options, callback);
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
