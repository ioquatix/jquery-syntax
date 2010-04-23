*** jQuery.Syntax [release-1.7] ***

jQuery.Syntax is a light-weight client-side syntax highlighter, which dynamically loads external dependencies (js & css) when required. It uses jQuery to make it cross-browser compatible and to simplify integration.

For downloads, documentation, compatibility, please see :
	http://www.oriontransfer.co.nz/software/jquery-syntax/

There are several plugins available (source code - for stable releases see the main project page above):
	[DokuWiki] -> http://github.com/ioquatix/jquery-syntax-dokuwiki
	[WordPress] -> http://github.com/ioquatix/jquery-syntax-wordpress

For licensing details, please see the included LICENSE.txt.

*** Change Log ***

release-1.7
 - Added support for YAML.
 - Fixed a bug in the bisection algorithm.
 - Added support for highlighting inline code tags.
 - Added short-hand notation <code class="syntax html"> (vs <code class="syntax brush-html">).
   - However, this only works in this exact case where class="syntax {language}"
 - Improved simple function to improve consistency.

release-1.6
 - Fixed a compatibility issue with jQuery 1.4.2.

release-1.5
 - Added support for [Visual] Basic, SQL and Lisp.
 - Enabled a small optimization in the bisection algorithm.
 - Fixed a bug with alias names (they weren't working).
 - Minor updates to several other brushes.
