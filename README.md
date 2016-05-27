# ng-smart-id

## Motivation

This library was created for making it easier to take advantage of smart ids when using PouchDB/CouchDB as a database.

PouchDB/CouchDB implement map/reduce, but that requires views that can take a while to build up, and to refresh when documents change.

[Using doc ids](https://pouchdb.com/2014/05/01/secondary-indexes-have-landed-in-pouchdb.html) in a smart way, you can avoid views altogether in a lot of cases.

## Usage
The `smartId` service provides two functions

### `parse`

```js
smartId.parse('asimov:foundation:1', 'author:series:bookNr')
```

will return
```js
{ author: 'asimov', series: 'foundation', bookNr: '1' }
```

Note that all fields will be returned as Strings.

### `idify`

```js
smartId.idify({ author: 'asimov', series: 'foundation', bookNr: 1 }, 'author:series:bookNr')
```

will return `asimov:foundation:1`

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
smartId.parse('asimov:foundation:1', 'bookSeries')
```

### Patterns

Patterns allow optional fields, to specify an optional field add `?` before the field name:

```js
smartId.parse('asimov:foundation:1:awesome', 'author:series:bookNr:?rating')
```

will return
```js
{ author: 'asimov', series: 'foundation', bookNr: '1', rating: 'awesome' }
```

while
```js
smartId.parse('asimov:foundation:1', 'author:series:bookNr:?rating')
```

will still return
```js
{ author: 'asimov', series: 'foundation', bookNr: '1' }
```

It is ok to specify as many optional fields as you wish, but all optional fields should appear at the end, that is, after all the non optional ones (`author:book:?rating` is allowed but `author:?book:rating` will throw an exception).

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
