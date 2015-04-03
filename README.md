#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coverall-image]][coverall-url]

> Generate logs based on conventional commits and templates


## Conventional Commit Message Format

Each input commit message consists of a **hash** (optional), a **header**, a **body** (optional) and a **footer** (optional).

```
<hash>
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### header

The header has a special format that includes a **type**, a **scope** (optional) and a **subject**

```
<type>(<scope>): <subject>
```

### footer

The footer should contain any information about **Important Notes** (optional) and is also the place to reference GitHub issues that this commit **references** (optional).

```
<important note>
<BLANK LINE>
<references>
```

[More details](CONVENTIONS.md)


## Install

```sh
$ npm install --save conventional-commits-template
```


## Usage

```js
var conventionalCommitsTemplate = require('conventional-commits-template');

conventionalCommitsTemplate(version, context, options);
```

It expects an object mode upstream and the object should look something like this:

```js
{ hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
  header: 'feat(scope): broadcast $destroy event on scope destruction',
  type: 'feat',
  scope: 'scope',
  subject: 'broadcast $destroy event on scope destruction',
  body: null,
  footer: 'Closes #1',
  notes: [],
  references: [ { action: 'Closes', repository: null, issue: '1', raw: '#1' } ] }
{ hash: '13f31602f396bc269076ab4d389cfd8ca94b20ba',
  header: 'feat(ng-list): Allow custom separator',
  type: 'feat',
  scope: 'ng-list',
  subject: 'Allow custom separator',
  body: 'bla bla bla',
  footer: 'BREAKING CHANGE: some breaking change',
  notes: [ { title: 'BREAKING CHANGE', text: 'some breaking change' } ],
  references: [] }
```

Each chunk should be a commit. Json object is also **valid**.


## API

### conventionalCommitsTemplate(version, [context, [options]])

Returns a transform stream.

#### version

Type: `string`

Version number of the up-coming release. This argument is **mandatory**.

#### context

Variables that will be interpolated to the template.

##### title

Type: `string` Default: `''`

##### isPatch

Type: `boolean` Default: `semver.patch(version) === 0`

By default, this value is true if `version`'s patch is `0`.

##### host

Type: `string`

The hosting website. Eg: `'https://github.com/'` or `'https://bitbucket.org/'`

##### repository

Type: `string`

The repository name on `host`. Eg: `'stevemao/conventional-commits-template'`.

##### linkReferences

Type: `boolean` Default: `true` if `host`, `repository`, `commit` and `issue` are truthy

Should all references be linked?

##### commit

Type: `string` Default: `'commits'`

Commit keyword in the url if `options.linkReferences === true`.

##### issue

Type: `string` Default: `'issues'`

Issue or pull request keyword in the url if `options.linkReferences === true`.

##### date

Type: `string` Default: `dateFormat(new Date(), 'yyyy-mm-dd', true)`

Default to formatted (`'yyyy-mm-dd'`) today's date. [dateformat](https://github.com/felixge/node-dateformat) is used for formatting the date.

#### options

Type: `object`

##### groupBy

Type: `string` Default: `'type'`

How to group the commits. If this value is falsy, commits are not grouped.

##### hashLength

Type: `number` Default: `7`

Instead of outputting the full SHA-1 values of the hash, try to abbreviate them to a shorter unique name.

##### maxSubjectLength

Type: `number` Default: `80`

The maximum subject length.

##### replacements

Type: `object` Default: `type: { fix: 'Bug Fixes', feat: 'Features', perf: 'Performance Improvements' }`

Replace with new values in each commit.

##### noteGroups

Type: `object` Default: `{ 'BREAKING CHANGE': 'BREAKING CHANGES' }`

Replace with new group titles. If a note's title is not in this mapping, the note will be ignored.

##### commitGroupsSort

Type: `function`, `string` or `array` Default: `'title'`

A compare function used to sort commit groups. If it's a string or array, it sorts on the property(ies) by `localeCompare`.

The string can be a dot path to a nested object property.

##### commitsSort

Type: `function`, `string` or `array` Default: `['scope', 'subject']`

A compare function used to sort commits. If it's a string or array, it sorts on the property(ies) by `localeCompare`.

The string can be a dot path to a nested object property.

##### noteGroupsSort

Type : `function` Default: `'title'`

A compare function used to sort note groups. If it's a string or array, it sorts on the property(ies) by `localeCompare`.

The string can be a dot path to a nested object property.

##### notesSort

Type: `function` Default: sort by `localeCompare`.

A compare function used to sort note groups. If it's a string or array, it sorts on the property(ies) by `localeCompare`.

The string can be a dot path to a nested object property.

##### mainTemplate

Type: `string` Default: [template.hbs](templates/template.hbs)

The main handlebar template.

##### headerPartial

Type: `string` Default: [header.hbs](templates/header.hbs)

##### commitPartial

Type: `string` Default: [commit.hbs](templates/commit.hbs)

##### footerPartial

Type: `string` Default: [footer.hbs](templates/footer.hbs)

##### partials

Type: `object`

Partials that used in the main template, if any. The key should be the partial name and the value should be handlebar template strings. **NOTE**: This value will overwrite `headerPartial`, `commitPartial` and `footerPartial`. If you are using handlebar template files, read files by yourself.


## Customization Guide

It is possible to customize this the changelog to suit your needs. Templates are written in [handlebars](http://handlebarsjs.com). You can customize all partials or the whole template. Template variables are from either `upstream` or `context`. The followings are a suggested way of defining variables.

### upstream

Variables in upstream are commit specific and should be used per commit. Eg: *commit date* and *commit username*. You can think of them as "local" or "isolate" variables.

### context

context should be module specific and can be used across the whole log. Thus these variables should not be related to any single commit and should be generic information of the module or all commits. Eg: *repository url* and *author names*, etc. You can think of them as "global" or "root" variables.

Basically you can make your own templates and define all your template variables. This module can iterate the commits and compile them. For more details, please checkout [handlebars](http://handlebarsjs.com) and the source code of this module.


## CLI

```sh
$ npm install --global conventional-commits-template
```

```sh
$ conventional-commits-template --help

Usage
  conventional-commits-template [<path>...]

Example
  conventional-commits-template commits.ldjson -v 1.0.0
  cat commits.ldjson | conventional-commits-template -v 1.0.0

Options

-v, --ver        Version number of the up-coming release
-t, --context    A filepath of a json that is used to define template variables
-o, --options    A filepath of a javascript object that is used to define options
```

It works with [Line Delimited JSON](http://en.wikipedia.org/wiki/Line_Delimited_JSON).

If you have commits.ldjson

```js
{"hash":"9b1aff905b638aa274a5fc8f88662df446d374bd","header":"feat(ngMessages): provide support for dynamic message resolution","type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution","body":"Prior to this fix it was impossible to apply a binding to a the ngMessage directive to represent the name of the error.","footer":"BREAKING CHANGE: The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.\nCloses #10036\nCloses #9338","notes":[{"title":"BREAKING CHANGE","text":"The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive."}],"references":[{"action":"Closes","repository":null,"issue":"10036","raw":"#10036"},{"action":"Closes","repository":null,"issue":"9338","raw":"#9338"}]}
```

And you run

```sh
$ conventional-commits-template commits.ldjson --ver 1.0.0
```

The results will be

```md
<a name=1.0.0></a>
## 1.0.0 (2015-03-25)


### Features

* **ngMessages:** provide support for dynamic message resolution 9b1aff9, closes #10036 #9338


### BREAKING CHANGES
* The &#x60;ngMessagesInclude&#x60; attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.

```

It is printed to stdout.


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/conventional-commits-template.svg
[npm-url]: https://npmjs.org/package/conventional-commits-template
[travis-image]: https://travis-ci.org/stevemao/conventional-commits-template.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/conventional-commits-template
[daviddm-image]: https://david-dm.org/stevemao/conventional-commits-template.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/conventional-commits-template
[coverall-image]: https://coveralls.io/repos/stevemao/conventional-commits-template/badge.svg
[coverall-url]: https://coveralls.io/r/stevemao/conventional-commits-template
