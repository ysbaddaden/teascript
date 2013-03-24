require 'execjs'

module TeaScript
  EngineError      = ExecJS::RuntimeError
  CompilationError = ExecJS::ProgramError

  module Source
    def self.path
      @path ||= ENV['TEASCRIPT_SOURCE_PATH'] || File.expand_path('../../tea-script.js', __FILE__)
    end

    def self.path=(path)
      @contents = @version = @context = nil
      @path = path
    end

    def self.contents
      @contents ||= File.read(path)
    end

    def self.context
      @context ||= ExecJS.compile(contents)
    end

    def self.version
      @version ||= '0.2.1'
    end
  end

  class << self
    def engine
    end

    def engine=(engine)
    end

    def version
      Source.version
    end

    def compile(script, options = {})
      script = script.read if script.respond_to?(:read)
      Source.context.call("Tea.compile", script, options)
    end
  end
end

require 'tea_script/tilt' if defined? ::Tilt
require 'tea_script/sprockets' if defined? ::Sprockets

