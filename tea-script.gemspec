Gem::Specification.new do |s|
  s.name = "tea-script"
  s.version = "0.2.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Julien Portalier"]
  s.date = "2013-03-23"
  s.description = "Ruby inspired language that transcompiles to JavaScript."
  s.email = "julien@portalier.com"
  s.files = [
    "lib/tea-script.rb",
    "lib/tea_script.rb",
    "lib/tea_script/tilt.rb",
    "lib/tea_script/sprockets.rb",
    "tea-script.js",
  ]
  #s.extra_rdoc_files = []
  s.homepage = "http://github.com/ysbaddaden/teascript"
  s.require_paths = ["lib"]
  s.rubygems_version = "2.0.0"
  s.summary = "Ruby inspired language that transcompiles to JavaScript."

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<execjs>, [">= 0"])
    else
      s.add_dependency(%q<execjs>, [">= 0"])
    end
  else
    s.add_dependency(%q<execjs>, [">= 0"])
  end
end
