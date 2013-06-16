class Token
  attr_accessor :name, :value, :line, :column

  def initialize(name, value, line = nil, column = nil)
    self.name   = name
    self.value  = value
    self.line   = line
    self.column = column
  end

  def inspect
    return name unless value
    return value if name.to_s == value
    return value.to_sym
  end

  alias to_s inspect

  def ===(other)
    name == other
  end

  def ==(other)
    name == other
  end

  def keyword?
    KEYWORDS.include?(self.name.to_s)
  end

  def operator?
    OPERATORS.include?(self.name.to_s)
  end

  def whitespace?
    name == :whitespace
  end

  def identifier?
    name == :identifier
  end

  def eof?
    name == :EOF
  end
end
