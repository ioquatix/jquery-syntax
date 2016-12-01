# jQuery.Syntax

jQuery.Syntax is a light-weight client-side syntax highlighter, which dynamically loads external dependencies (JavaScript & CSS) when required. It uses jQuery to make it cross-browser compatible and to simplify integration and integration with other systems.

For examples and documentation please see the main [project page][1].

[1]: http://www.codeotaku.com/projects/jquery-syntax

## Installation

jQuery.Syntax has two options for installation. Both options require a modern copy of [jQuery](http://jquery.com). A full set of installation instructions are [available online](http://www.codeotaku.com/projects/jquery-syntax/how-to-install).

### Simple Installation

A full distribution is included in `public/` and you can copy these files to your website, typically in a subdirectory appropriate for JavaScript.

### Advanced Installation

The advanced option involves a local install of Ruby and several gems to compile and minify a complete distribution of jQuery.Syntax into a specific directory. The process is controlled through a file called `install.yaml` which has several configuration options. To use this method you need several dependencies:

	$ gem install bundler && bundle install

To install jQuery.Syntax into the standard 'public/' directory:

	$ rake install

For more details on how to customize this process, please see the [Advanced Setup](http://www.codeotaku.com/projects/jquery-syntax/how-to-install/advanced-setup) documentation.

## Usage

jQuery.Syntax is typically used to highlight both block code elements and inline code elements. To highlight code, you first need to include several scripts in the `<head>` of your page:

	<script src="jquery.min.js" type="text/javascript"></script>
	<script src="jquery.syntax.min.js" type="text/javascript"></script>
	<script type="text/javascript">
	    // This function is executed when the page has finished loading.
	    jQuery(function($) {
	        // This function highlights (by default) pre and code tags which are annotated correctly.
	        $.syntax();
	    });
	</script>

In the `<body>` of your document, you can now include code and it will be automatically highlighted provided it uses the following two forms.

### Inline Code Layout

This is typically useful when discussing small blocks of classes in a paragraph, e.g. class names, short statements/expressions, etc:

	<p>The entry point for C code is typically the <code class="syntax clang">int main(int argv, char ** argv)</code> function.</p>

### Block Code Layout

This is typically useful when listing whole functions, classes, or entire files:

	<p>The following function returns 0 back to the controlling terminal:</p>

	<pre class="syntax clang">
	int main(int argv, char ** argv)
	{
		return 0;
	}
	</pre>

You will need to escape code correctly using standard HTML escape sequences, e.g. `&amp;`. As an alternative, you may prefer to use CDATA sections:

	<pre class="syntax javascript"><![CDATA[
	function hello () {
	    console.log("Hello World");
	}]]></pre>

## Plugins

There are several plugins available:

- DokuWiki: <http://github.com/ioquatix/jquery-syntax-dokuwiki>
- WordPress: <http://github.com/ioquatix/jquery-syntax-wordpress>

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
