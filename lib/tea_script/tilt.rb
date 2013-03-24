require 'tea_script'
require 'tilt'
require 'tilt/template'

module Tilt
  class TeaScriptTemplate < Template
    self.default_mime_type = 'application/javascript'

    def self.engine_intialized?
      #defined? ::TeaScript
      true
    end

    def initialize_engine
      #require_template_library 'tea_script'
    end

    def prepare
    end

    def evaluate(scope, locals, &block)
      @output ||= TeaScript.compile(data, options)
    end

    def allows_script?
      false
    end
  end

  register TeaScriptTemplate, 'tea'
end


