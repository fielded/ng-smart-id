# ng-smart-id

[![Build Status](https://travis-ci.org/fielded/ng-smart-id.svg)](https://travis-ci.org/fielded/ng-smart-id) ![Dependecy Status](https://david-dm.org/fielded/ng-smart-id.svg) ![Dev Dependecy Status](https://david-dm.org/fielded/ng-smart-id/dev-status.svg)

## Motivation

This library was created for making it easier to take advantage of smart ids when using PouchDB/CouchDB as a database.

In PouchDB/CouchDB it is best practice to use meaningful ids. Meaningful ids allow querying data in a more efficient way [without the need of constructing views](https://pouchdb.com/2014/05/01/secondary-indexes-have-landed-in-pouchdb.html), that can be slow to build up and to dinamically refresh.

The id schema used in this module is based on the recommendations from [CouchDB Best Practices](http://ehealthafrica.github.io/couchdb-best-practices/#one-to-n-relations).

## Usage
The `smartId` service provides two functions

### `parse`

```js
smartId.parse('author:asimov:series:foundation:bookNr:1')
```

will return
```js
{ author: 'asimov', series: 'foundation', bookNr: '1' }
```

Note that all fields will be returned as Strings.

An optional pattern can be provided for validation purposes (see [patterns](#Patterns)). If the id is missing any of the
non optional fields specified in the pattern, an exception is thrown.

```js
smartId.parse('author:asimov:series:foundation:bookNr:1', 'author:series:bookNr:?publicationYear')
```

will return
```js
{ author: 'asimov', series: 'foundation', bookNr: '1' }
```

while
```js
smartId.parse('author:asimov:series:foundation:bookNr:1', 'author:series:bookNr:publicationYear')
```

will throw an exception


### `idify`

```js
smartId.idify({ author: 'asimov', series: 'foundation', bookNr: 1 }, 'author:series:bookNr')
```

will return `author:asimov:series:foundation:bookNr:1`

Fields containing `undefined`, `null` or `''` will be ignored. Example:

```js
smartId.idify({ author: 'asimov', series: 'foundation', bookNr: undefined }, 'author:series:?bookNr')
```

will return `author:asimov:series:foundation`

### Config

It is possible to configure the separator for id fields, if no separator is provided `:` is used by default.

To configure it add a `value` to your Angular module:

```js
angular.module('myMod', [])
  .value('ngSmartIdSeparator', '-')
```

You can also provide a set of patterns to be reused through the application:

```js
angular.module('myMod', [])
  .value('ngSmartIdPatterns', {
    'bookSeries': 'author:series:bookNr',
    'singleBook': 'author:book'
  })
```

Pass a preconfigured pattern id as an argument to `parse` or `idify`:

```js
smartId.parse('author:asimov:series:foundation:bookNr:1', 'bookSeries')
```

### Patterns

Patterns allow optional fields, to specify an optional field add `?` before the field name:

```js
smartId.parse('author:asimov:series:foundation:bookNr:1:rating:awesome', 'author:series:bookNr:?rating')
```

will return
```js
{ author: 'asimov', series: 'foundation', bookNr: '1', rating: 'awesome' }
```

while
```js
smartId.parse('author:asimov:series:foundation:bookNr:1', 'author:series:bookNr:?rating')
```

will still return
```js
{ author: 'asimov', series: 'foundation', bookNr: '1' }
```

## Installation

Install with bower:

    bower install --save git@github.com:fielded/ng-smart-id.git

Then simply add `ngSmartId` as a dependency somewhere in your project that makes sense and you're good to go.

## Contributing

### Installation

```bash
# Clone the GitHub repository
git clone git@github.com:fielded/ng-smart-id.git
# Change into project folder
cd ng-smart-id
# Install the dev dependencies
npm install
```

### Test Suite

The test suite is configured to run with PhantomJS and is powered by:

- Karma
- Jasmine

#### Running Tests

```bash
npm test
```

## Release Process

To make a release, you need to run `npm run build`, commit the `dist` folder and tag the commit with an appropiate version according to the [SemVer spec](http://semver.org/).

## License

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the License for the specific language governing permissions and limitations under the License.
