## Crammer

A Yeoman generator for an AngularJS project that uses GulpJS to compile
everything into a single HTML file.

That includes AngularJS partials, stylesheets, scripts, and images.

It comes with bootstrap and it does some sensible things like optimising images
that I think I took from another gulp angular generator I can't recall the
name of...

You can rip out bootstrap and angular pretty easily if you want to.

### Install

(It's not on npm yet so ignore this)

```bash
$ npm install -g generator-crammer
```

### Usage

```bash
$ yo crammer project_name
$ cd project_name
$ gulp
$ open dist/index.html # on a mac at least
```
