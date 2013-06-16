module TeaScript
  class Lexer
    attr_accessor :input, :index, :line, :column, :tokens, :state

    def self.re(ary, bound = nil)
      Regexp.new('\A(' + ary.map { |t| Regexp.escape(t) }.join('|') + ')' + (bound ? '\b' : ''))
    end

    KEYWORDS_RE  = re(KEYWORDS, true)
    OPERATORS_RE = re(OPERATORS)
    PARENS_RE    = re(PARENS)

    REGEXP = %w{
      ( , = : [ ! & | ? { } ; ~ + - * % ^ < >
      return when if else elsif unless
    }

    def initialize(input)
      self.input  = input.chomp
      self.index  = 0
      self.line   = 1
      self.column = 1
      self.tokens = []
      self.state  = []
    end

    def tokenize
      loop do
        str = input[self.index..-1]

        if str.nil? or str.empty?
          tokens << token(:EOF)
          break
        end

        case state.last
        when :embed
          next if match_embed(str) == :skip
        end

        match(str)
      end

      return Rewriter.new(tokens).rewrite
    end

    def match(str)
      tok = case str
      when /\A((?:#.*\n\s*)*#[^\n]*)/    then :COMMENT
      when /\A\n/                        then linefeed
      when /\A(;)/                       then $1
      when /\A(true|false)\b/            then :BOOL
      when /\A(null|nil|undefined)\b/    then :NIL
      when /\A(\d+)\b/                   then :NUMBER
      when /\A((\d+)?\.\d+)\b/           then :NUMBER
      when /\A\//                        then regexp(str); return
      when KEYWORDS_RE                   then $1.to_sym
      when OPERATORS_RE                  then $1
      when PARENS_RE                     then $1
      when /\A([a-zA-Z][a-zA-Z0-9]*)\b/  then :identifier
      when /\A([ \t\r]+)/                then :whitespace
      #when /\A('(\.|[^\'])*')/           then :STRING
      when /\A(')/                       then string(str); return
      when /\A(")/                       then embedable_string(str); return
      else throw :unknown_token
      end
      tokens << token(tok, $1) if tok
    end

    def match_embed(str)
      case str
      when /\A#\{/
        tokens << token('+', '+')
        tokens << token('(', '(')
        :skip
      when /\A\}/
        if str[1] == '"'
          tokens << token(')', ')')
          tokens << token(')', ')')
          state.pop() # :embed
          state.pop() # :string
        else
          # tokens << token(')', ')')
          # tokens << token('+', '+')
          # tokens << token('"', '"')
          consume(1)
          unput(') + "')
          state.pop() # :embed
        end
        :skip
      end
    end

    def linefeed
      self.line += 1
      self.column = 0
      consume(1)
      :LF
    end

    def embedable_string(str)
      string(str)
      if state.last == :string
        tokens << token(')', ')')
        state.pop
      end
    end

    def string(str)
      quote, idx, value = str[0], 1, ""
      re = quote == '"' ? /\A([^"]*")/ : /\A([^']*')/

      loop do
        if str[idx..-1] =~ re
          text = $1

          if quote == '"' and (j = (text =~ /#\{/))
            value += text[0..(j - 1)] + quote
            embed
            break
          else
            value += text

            if text.end_with?("\\#{quote}")
              idx += text.size
            else
              break
            end
          end
        else
          throw :unterminated_string
        end
      end

      tokens << token(:STRING, quote + value)
    end

    def embed
      unless state.last == :string
        tokens << token('(', '(')
        state << :string
      end
      state << :embed
      consume(-2)
    end

    def regexp(str)
      if !tokens.last or REGEXP.include?(tokens.last.name)
        if str =~ /\A(\/(\.|[^\\\/])*\/[gimy]*)/
          tokens << token(:REGEXP, $1)
          return
        end
      end
      tokens << token('/', '/')
    end

    def token(tok, value = nil)
      consume(value.size) if value
      Token.new(tok, value , line, column)
    end

    def consume(size)
      self.index  += size
      self.column += size
    end

    def unput(str)
      input.insert(self.index, str)
    end
  end
end
