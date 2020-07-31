
require 'rack/static'

use Rack::Static, :urls => ["/"], :root => "./"

run lambda { |env| $stderr.puts("404 #{env['REQUEST_PATH']}"); [404, {}, []] }
