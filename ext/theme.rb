
class Theme
	def initialize(dst_dir, root = nil)
		@destination = dst_dir
		
		@includes = []
		@root = root
		
		@extends = {}
		
		@depends = []
	end
	
	attr :includes
	
	def load_theme(theme_dir, top = true)
		theme_dir = File.join(@root, theme_dir)
		theme_name = File.basename(theme_dir)
		
		master = Dir.glob(File.join(theme_dir, "master.{sass,scss}"))
		if master.size > 0
			@includes += master
		end
	
		unless File.directory?(theme_dir)
			raise StandardError.new("Could not find theme #{theme_dir}!")
		end
	
		$stderr.puts "Loading theme from #{theme_dir}..."
		theme_config_path = File.join(theme_dir, "_config.yaml")
		config = {}
	
		# Is there a configuration file?
		if File.exist? theme_config_path
			config = YAML::load_file(theme_config_path) || {}
		end
	
		# Load any dependencies recursively - if you have bad configuration this might
		# give you visions of infinity.
		if config['depends']
			@depends += config['depends']
			config['depends'].each {|name| load_theme(name, false)}
		end
		
		# Remove any files/directories that have been excluded
		if config['exclude']
			config['exclude'].each do |name|
				FileUtils.rm_rf(File.join(@destination, name))
			end
		end
		
		if config['extends']
			config['extends'].each {|name,extension| @extends[name] = extension}
		end
		
		if config['includes']
			@includes.concat(config['includes'])
		end
		
		if top
			# Copy all the theme files
			$stderr.puts "Copying #{theme_dir + "/*"} to #{@destination.inspect}"
			
			theme_files = Dir.glob(File.join(theme_dir, "*"))
			FileUtils.cp_r(theme_files, @destination)
			
			File.open(File.join(@destination, "theme.js"), "w") do |theme_js|
				theme_js.puts "Syntax.themes[#{theme_name.inspect}] = #{@depends.inspect}"
			end
		end
	end
	
	def includes_for(path, place)
		case place
		when :prepend
			return @includes
		when :append
			if extension = @extends[File.basename(path)]
				return extension
			end
		end
		
		return []
	end
end
