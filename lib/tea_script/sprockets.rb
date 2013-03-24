require 'sprockets'
require 'tea_script/tilt'

module Sprockets
  register_engine '.tea', Tilt::TeaScriptTemplate
end
