var generators = require('yeoman-generator')
var fleck = require('fleck')

module.exports = generators.NamedBase.extend({
  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.NamedBase.apply(this, arguments)
  },
  makeDir: function () {
    this.mkdir(this.destinationPath(this.name))
  },
  writing: {
    copyTemplates: function () {
      [
        'package.json',
        'bower.json',
        'gulp/build.js',
        'app/index.html',
        'app/scripts/main.js'
      ].forEach(function(path) {
        this.template(this.templatePath(path), this.destinationPath(this.name, path), {appName: this.name, fleck: fleck})
      }.bind(this))
    },
    copyStatic: function () {
      this.directory(this.templatePath('static'), this.destinationPath(this.name))
    },
  },
  install: function () {
    process.chdir(this.destinationPath(this.name))
    this.installDependencies()
  }
})
