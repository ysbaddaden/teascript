module TeaScript
  KEYWORDS = %w{
    def delete return then do end
    if unless else elsif case when while until loop for in own of
    break next new throw begin rescue ensure
    and or not typeof instanceof
  }.freeze

  OPERATORS = %w{
    -> += -= *= /= %= &= |= ^= ||= >>= <<=
    + - ~ * / % & | ^ << >> == != <= < => >
    ... .. . , = : ?
  }.freeze

  PARENS = %w{ ( ) \{ \} [ ] }.freeze
end

require_relative 'token'
require_relative 'lexer'
require_relative 'rewriter'

def debug(code)
  lexer = TeaScript::Lexer.new(code)
  tokens = lexer.tokenize
  puts tokens.map(&:inspect).join(' ')
  puts
end

debug "def A(a)\nreturn a + 1\n\n\n end"
debug "def A default = nil\nreturn a + 1\n end"
debug "describe 'DSL', -> {\n  it 'must be ok', -> {\n    assert.ok true\n  }\n}"
debug "lmbd = ->(rs) { doSomething() }"
debug "'I can\\'t be damned.'"
debug "'This is a string\nspanning on\nmultiple lines'"
debug '"debug: #{hello} #{world}".test(something)'
debug '"total: #{amount} €"'
debug '/azerty/i'
debug '# this is a comment'
debug "# this is a comment\n# spanning on\n# multiple lines"
debug "select = readkey() - 1 #comment"
debug "{ a: -> {},\n #comment\nb: -> {} }"

