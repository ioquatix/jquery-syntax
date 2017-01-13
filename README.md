# jQuery.Syntax

jQuery.Syntax is a light-weight client-side syntax highlighter, which dynamically loads external dependencies (JavaScript & CSS) when required. It uses jQuery to make it cross-browser compatible and to simplify integration and integration with other systems.

## Motivation

jQuery.Syntax was built at a time when syntax highlighting on the web was a bit of a mess - browser incompatibilities and limitations made it hard to do the right thing consistently. Rather than a single definition of "good", presenting code nicely in a browser was dictated by a set of trade-offs.

At the time, syntax highlighters were often all-or-nothing - this made it cumbersome for sites that only had a few pages with code on them. jQuery.Syntax was designed from the ground up to use dynamic loading of assets when required. On top of that, the implementation was built using a profiler and is fairly efficient.

It's a good library and it's fast, that's why I continue to maintain and develop it.

### Isn't jQuery big?

Your right, small is pretty subjective.

jQuery as a dependency is based on a design from 2012. When browsers were a bit less "compatible", this was a good trade-off. These days, it could probably be removed, but it isn't worth the effort and for me personally it's a zero-cost dependency since I use it anyway on most of my sites.

The library is modular and only loads exactly the CSS and JS required. The minimised and gzipped library is 1.6Kbytes, this provide the top-level API and the dynamic loading functionality.

To highlight anything, you need to load the core parser and renderer code. It's 4.1Kbytes minified and gzipped. The CSS and Script files are tiny, most less < 1Kbyte, per language.

### Compared to xyz?

All syntax highlighters are pretty good these days. But, there are some key differences worth considering:

- How much does it load by default, even when not highlighting anything?
- How efficient/fast is it when highlighting code?
- How does line wrapping work?
- Can you embed `<span>` and `<a>` elements?
- Can it handle embedded code (e.g. JavaScript inside HTML)?
- Is it easy to install?
- Is it easy to customize?

## Installation

jQuery.Syntax is easily installed using bower.

	$ bower install jquery-syntax

It has a `dist/` directory which follows standard conventions.

### Advanced Configuration

jQuery.Syntax compiles and minifies it's code using uses Rake (Ruby) and [Sass](http://sass-lang.com). Please review the included `Rakefile` and `install.yaml` for more details.

## Usage

jQuery.Syntax is typically used to highlight both block code elements and inline code elements. To highlight code, you first need to include several scripts in the `<head>` of your page:

	<!-- Put in your head tag -->
	<script src="jquery.min.js"></script>
	<script src="jquery.syntax.min.js"></script>
	
	<script type="text/javascript">
		// This function is executed when the page has finished loading.
		jQuery(function($) {
			$.syntax({theme: 'bright'});
		});
	</script>
	
	<!-- Your code to highlight -->
	<pre><code class="language-ruby">puts "Hello World"</code></pre>

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

Released under the MIT license.

Copyright, 2016, by [Samuel G. D. Williams](http://www.codeotaku.com/samuel-williams).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
