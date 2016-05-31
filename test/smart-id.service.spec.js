'use strict'

describe('smartId', function () {
  var smartId
  var testMod // eslint-disable-line

  describe('with default separator', function () {
    beforeEach(function () {
      testMod = angular.module('testMod', ['ngSmartId'])
    })

    beforeEach(module('testMod'))

    beforeEach(inject(function (_smartId_) {
      smartId = _smartId_
    }))

    describe('parse', function () {
      it('should parse an id according to the given pattern', function () {
        var id = 'country:usa:city:nyc:year:2016'
        var obj = { country: 'usa', city: 'nyc', year: '2016' }
        expect(smartId.parse(id)).toEqual(obj)
      })
      it('accepts optional fields in the pattern, if a pattern is provided', function () {
        var pattern = 'country:city:year:?month'
        var partialId = 'country:usa:city:nyc:year:2016'
        var partialObj = { country: 'usa', city: 'nyc', year: '2016' }
        var fullId = 'country:usa:city:nyc:year:2016:month:03'
        var fullObj = { country: 'usa', city: 'nyc', year: '2016', month: '03' }
        expect(smartId.parse(partialId, pattern)).toEqual(partialObj)
        expect(smartId.parse(fullId, pattern)).toEqual(fullObj)
      })
      it('throws if non optional fields are missing in the id, when a pattern is provided', function () {
        var id = 'country:usa:city:nyc'
        var pattern = 'country:city:year'
        expect(smartId.parse.bind(null, id, pattern)).toThrow()
      })
    })
    describe('idify', function () {
      it('should convert an object into an id following a given pattern', function () {
        var pattern = 'country:city:year'
        var obj = { country: 'usa', city: 'nyc', year: '2016' }
        var id = 'country:usa:city:nyc:year:2016'
        expect(smartId.idify(obj, pattern)).toBe(id)
      })
      it('discards fields containing `undefined`, `null` or `""`', function () {
        var pattern = 'country:city:?year'
        var obj = { country: 'usa', city: 'nyc' }
        var id = 'country:usa:city:nyc'
        obj.year = undefined
        expect(smartId.idify(obj, pattern)).toBe(id)
        obj.year = null
        expect(smartId.idify(obj, pattern)).toBe(id)
        obj.year = ''
        expect(smartId.idify(obj, pattern)).toBe(id)
      })
      it('accepts optional fields in the pattern', function () {
        var pattern = 'country:city:year:?month'
        var partialId = 'country:usa:city:nyc:year:2016'
        var partialObj = { country: 'usa', city: 'nyc', year: '2016' }
        var fullId = 'country:usa:city:nyc:year:2016:month:03'
        var fullObj = { country: 'usa', city: 'nyc', year: '2016', month: '03' }
        expect(smartId.idify(partialObj, pattern)).toBe(partialId)
        expect(smartId.idify(fullObj, pattern)).toBe(fullId)
      })
      it('fails if no value provided for non optional fields', function () {
        var pattern = 'country:city:year:week'
        var obj = { country: 'usa', city: 'nyc', year: '2016' }
        expect(smartId.idify.bind(null, obj, pattern)).toThrow()
      })
    })
  })
  describe('configuring a separator', function () {
    beforeEach(function () {
      testMod = angular.module('testMod', ['ngSmartId']).value('ngSmartIdSeparator', '-')
    })

    beforeEach(module('testMod'))

    beforeEach(inject(function (_smartId_) {
      smartId = _smartId_
    }))

    it('uses the given separator for parsing', function () {
      var id = 'country-usa-city-nyc-year-2016'
      var pattern = 'country-city-year'
      var obj = { country: 'usa', city: 'nyc', year: '2016' }
      expect(smartId.parse(id, pattern)).toEqual(obj)
    })
    it('uses the given separator for constructing the id', function () {
      var pattern = 'country-city-year'
      var obj = { country: 'usa', city: 'nyc', year: '2016' }
      var id = 'country-usa-city-nyc-year-2016'
      expect(smartId.idify(obj, pattern)).toBe(id)
    })
  })
  describe('configuring an array of patterns', function () {
    beforeEach(function () {
      testMod = angular.module('testMod', ['ngSmartId']).value('ngSmartIdPatterns', { first: 'country:city:year' })
    })

    beforeEach(module('testMod'))

    beforeEach(inject(function (_smartId_) {
      smartId = _smartId_
    }))

    it('can use a pre-configured pattern for parsing', function () {
      var id = 'country:usa:city:nyc:year:2016'
      var obj = { country: 'usa', city: 'nyc', year: '2016' }
      expect(smartId.parse(id, 'first')).toEqual(obj)
    })
    it('can still use a pattern provided as argument to the parse function', function () {
      var id = 'country:usa:city:nyc:year:2016'
      var pattern = 'country:city:year'
      var obj = { country: 'usa', city: 'nyc', year: '2016' }
      expect(smartId.parse(id, pattern)).toEqual(obj)
    })
    it('can use a pre-configured pattern for constructing the id', function () {
      var obj = { country: 'usa', city: 'nyc', year: '2016' }
      var id = 'country:usa:city:nyc:year:2016'
      expect(smartId.idify(obj, 'first')).toBe(id)
    })
    it('can still use a pattern provided as argument to the idify function', function () {
      var pattern = 'country:city:year'
      var obj = { country: 'usa', city: 'nyc', year: '2016' }
      var id = 'country:usa:city:nyc:year:2016'
      expect(smartId.idify(obj, pattern)).toBe(id)
    })
  })
})
