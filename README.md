# jQuery.Syntax [release-3.0] #

jQuery.Syntax is a light-weight client-side syntax highlighter, which dynamically loads external dependencies (JavaScript & CSS) when required. It uses jQuery to make it cross-browser compatible and to simplify integration.

To use jQuery.Syntax with minimal work, simply review the examples and use the files in the public sub-directory.

For more advanced usage and customisation, you will need to install the following dependencies to use jQuery.Syntax:
	$ sudo gem install rake haml

To install jQuery.Syntax into the standard 'public' directory
	$ rake install

To customise the install process, including destination directory and theme, edit <tt>install.yaml</tt>.

jQuery.Syntax depends on jQuery 1.4.1+.

For downloads, documentation, compatibility, please visit <http://www.oriontransfer.co.nz/software/jquery-syntax/>

There are several plugins available (source code - for stable releases see the main project page above):

 - DokuWiki: <http://github.com/ioquatix/jquery-syntax-dokuwiki>
 - WordPress: <http://github.com/ioquatix/jquery-syntax-wordpress>

## License ##

Copyright (c) 2011 Samuel G. D. Williams. <http://www.oriontransfer.co.nz>

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

## Change Log ##

### release-3.0 ###
 - Changed license from AGPL to MIT.
 - Improvements to the following brushes: C#, Objective-C, Java, Ruby, PHP, HTML, SQL, Assembly, Bash
 - Added support for perl style regular expressions.
 - Improved bash brush formatting and command matching.
 - Fixed some issues when highlighting ruby code with scope operator '::' and symbols.
 - Bug fixes to rakefile - new environment variable PREFIX determines install location.
 - Improvements to XML brush including supporting CDATA tags.
 - Bug fixes to several brushes including:
    - Objective-C methods (incorrect highlighting of last argument).
    - Diff insertion and deletion how highlight the background row colour.
    - Camel case type now expects a capital letter in the first non-underscore position.
    - Improved the style of XML entities, percent-escapes.
 - Several examples now included in examples sub-directory.
 - Default install now included in public sub-directory.
 - Fixed minor issue in path detection regular expression.
 - Installation now staged directly into destination directory.
 - Installation now supports configuration files.
 - Minor fixes to brushes.
 - Support for marked up content.
 - Support for several new languages (Kai, io).
 - Installation process (now the recommended process).
 - Enhanced support for themes.
 - Support for derived brushes.

### release-2.2.2 ###
 - Major Internet Exploder bugfix.

### release-2.2 ###
 - Added support for Lua, C#
 - Added new fixed and list layouts.
 - Improvements to whitespace handling.
 - Several bug fixes and enhancements.

### release-1.9.1 ###
 - Added several new languages.
 - Minor bug fixes and enhancements.

### release-1.8 ###
 - Improved the simple function usability.
 - Improved shorthand notation so it is now more flexible.
   - You can now specify a combination of classes, in any order.

### release-1.7 ###
 - Added support for YAML.
 - Fixed a bug in the bisection algorithm.
 - Added support for highlighting inline code tags.
 - Added shorthand notation
 - Improved simple function to improve consistency.

Shorthand notation depends on the classes being in a specific order, i.e. <tt>"syntax {language}"</tt>. e.g.

	<code class="syntax html">

Previously, this would have been written as (and is still acceptable):

	<code class="syntax brush-html">

### release-1.6 ###
 - Fixed a compatibility issue with jQuery 1.4.2.

### release-1.5 ###
 - Added support for [Visual] Basic, SQL and Lisp.
 - Enabled a small optimization in the bisection algorithm.
 - Fixed a bug with alias names (they weren't working).
 - Minor updates to several other brushes.
