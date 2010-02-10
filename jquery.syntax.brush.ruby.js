// brush: "ruby" aliases: []

/*
	# This ruby code will generate a list of classes.
	classes = []

	ObjectSpace.each_object(Class) do |c|
		classes << c
	end

	puts classes.collect{|cls| cls.name}.inspect
*/

Syntax.register('ruby', function(brush) {
	var keywords = ["alias", "and", "begin", "break", "case", "class", "def", "define_method", "defined", "do", "each", "else", "elsif", "end", "ensure", "false", "for", "if", "in", "module", "new", "next", "nil", "not", "or", "raise", "redo", "rescue", "retry", "return", "self", "super", "then", "throw", "true", "undef", "unless", "until", "when", "while", "yield"];
	
	var types = ["Socket", "UNIXServer", "UNIXSocket", "UDPSocket", "TCPServer", "TCPSocket", "IPSocket", "BasicSocket", "SocketError", "Pathname", "StopIteration", "Enumerable::Enumerator", "Binding", "UnboundMethod", "Method", "Proc", "SystemStackError", "LocalJumpError", "Struct::Tms", "Process::Status", "Time", "Dir", "File::Stat", "File", "IO", "EOFError", "IOError", "Range", "MatchData", "Regexp", "RegexpError", "Struct", "Hash", "Array", "Errno::EDQUOT", "Errno::ESTALE", "Errno::EINPROGRESS", "Errno::EALREADY", "Errno::EHOSTUNREACH", "Errno::EHOSTDOWN", "Errno::ECONNREFUSED", "Errno::ETIMEDOUT", "Errno::ETOOMANYREFS", "Errno::ESHUTDOWN", "Errno::ENOTCONN", "Errno::EISCONN", "Errno::ENOBUFS", "Errno::ECONNRESET", "Errno::ECONNABORTED", "Errno::ENETRESET", "Errno::ENETUNREACH", "Errno::ENETDOWN", "Errno::EADDRNOTAVAIL", "Errno::EADDRINUSE", "Errno::EAFNOSUPPORT", "Errno::EPFNOSUPPORT", "Errno::EOPNOTSUPP", "Errno::ESOCKTNOSUPPORT", "Errno::EPROTONOSUPPORT", "Errno::ENOPROTOOPT", "Errno::EPROTOTYPE", "Errno::EMSGSIZE", "Errno::EDESTADDRREQ", "Errno::ENOTSOCK", "Errno::EUSERS", "Errno::EILSEQ", "Errno::EOVERFLOW", "Errno::EBADMSG", "Errno::EMULTIHOP", "Errno::EPROTO", "Errno::ENOLINK", "Errno::EREMOTE", "Errno::ENOSR", "Errno::ETIME", "Errno::ENODATA", "Errno::ENOSTR", "Errno::EIDRM", "Errno::ENOMSG", "Errno::ELOOP", "Errno::ENOTEMPTY", "Errno::ENOSYS", "Errno::ENOLCK", "Errno::ENAMETOOLONG", "Errno::EDEADLK", "Errno::ERANGE", "Errno::EDOM", "Errno::EPIPE", "Errno::EMLINK", "Errno::EROFS", "Errno::ESPIPE", "Errno::ENOSPC", "Errno::EFBIG", "Errno::ETXTBSY", "Errno::ENOTTY", "Errno::EMFILE", "Errno::ENFILE", "Errno::EINVAL", "Errno::EISDIR", "Errno::ENOTDIR", "Errno::ENODEV", "Errno::EXDEV", "Errno::EEXIST", "Errno::EBUSY", "Errno::ENOTBLK", "Errno::EFAULT", "Errno::EACCES", "Errno::ENOMEM", "Errno::EAGAIN", "Errno::ECHILD", "Errno::EBADF", "Errno::ENOEXEC", "Errno::E2BIG", "Errno::ENXIO", "Errno::EIO", "Errno::EINTR", "Errno::ESRCH", "Errno::ENOENT", "Errno::EPERM", "Bignum", "Float", "Fixnum", "Integer", "Numeric", "FloatDomainError", "ZeroDivisionError", "ThreadGroup", "Continuation", "Thread", "ThreadError", "SystemCallError", "NoMemoryError", "SecurityError", "RuntimeError", "NotImplementedError", "LoadError", "SyntaxError", "ScriptError", "NoMethodError", "NameError::message", "NameError", "RangeError", "IndexError", "ArgumentError", "TypeError", "StandardError", "Interrupt", "SignalException", "fatal", "SystemExit", "Exception", "String", "FalseClass", "TrueClass", "Data", "Symbol", "NilClass", "Class", "Module", "Object"];
	
	var operators = ["+", "*", "/", "-", "&", "|", "~", "!", "%", "<", "=", ">"];
	var values = ["this", "true", "false", "nil", /[0-9]+(\.[0-9]+)?/g];
	
	brush.push(values, {klass: 'constant', children: null});
	brush.push(types, {klass: 'type', children: null})
	brush.push(keywords, {klass: 'keyword', children: null})
	brush.push(operators, {klass: 'operator', children: null})
	
	brush.push(Syntax.lib.perlStyleComment)
	
	brush.push({pattern: /".+?"/g, klass: 'string', children: ['escape']});
	brush.push({pattern: /\\./g, klass: 'escape'});
	
	brush.push(Syntax.lib.rubyStyleFunction);
});

