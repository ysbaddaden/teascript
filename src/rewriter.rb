module TeaScript
  class Rewriter
    attr_accessor :tokens, :state

    ARGUMENT = %w{
      BOOL NIL NUMBER STRING REGEXP identifier
      ( [ \{ * -> ~ not typeof new
    }.freeze # + -

    SKIP = (OPERATORS + PARENS + [:LF, :COMMENT]).freeze

    def initialize(tokens)
      self.tokens = tokens
      self.state  = []
    end

    def rewrite
      i, rs = 0, []

      while token = tokens[i]
        i += 1

        case token.name
        when :whitespace
          if rs.last == :identifier and argument?(tokens[i])
            state << :call
            rs << Token.new('(', '(', token.line, token.column)
          end
          next

        when :LF
          if state.last == :call
            state.pop
            rs << Token.new(')', ')', token.line, token.column)
          elsif rs.last and SKIP.include?(rs.last.name)
            next
          end

        when '{'
          if state.last == :lambda_def
            state.pop
            state << :lambda
          else
            state << :object
          end

        when '('         then state << :paren
        when ')'         then state.pop # either :call or :paren
        when '->'        then state << :lambda_def
        when '}'         then state.pop # either :lambda or :object
        when :COMMENT    then next
        when :EOF        then
          while s = state.pop
            rs << Token.new(')', ')', token.line, token.column) if s == :call
          end
          return rs
        end

        rs << token
      end

      rs
    end

    def argument?(token)
      ARGUMENT.include?(token.name.to_s)
    end

  end
end
