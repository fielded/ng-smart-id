'use strict'

describe('smartId', function () {
  var smartId

  beforeEach(module('ngSmartId'))

  beforeEach(inject(function (_smartId_) {
    smartId = _smartId_
  }))

  it('should be defined', function () {
    expect(smartId).toBeDefined()
  })

  describe('parse', function () {
    it('should parse an id according to the given pattern', function () {
      var id = 'usa:nyc:2016'
      var pattern = 'country:city:year'
      var obj = { country: 'usa', city: 'nyc', year: '2016' }
      expect(smartId.parse(id, pattern)).toEqual(obj)
    })
    it('accepts optional fields in the pattern', function () {
      var pattern = 'country:city:year:?month'
      var partialId = 'usa:nyc:2016'
      var partialObj = { country: 'usa', city: 'nyc', year: '2016' }
      var fullId = 'usa:nyc:2016:03'
      var fullObj = { country: 'usa', city: 'nyc', year: '2016', month: '03' }
      expect(smartId.parse(partialId, pattern)).toEqual(partialObj)
      expect(smartId.parse(fullId, pattern)).toEqual(fullObj)
    })
    it('does not accept non optional fields after optional fields', function () {
      var id = 'usa:nyc:2016:03:06'
      var pattern = 'country:city:year:?month:week'
      expect(smartId.parse.bind(null, id, pattern)).toThrow()
    })
  })
  describe('idify', function () {
    it('should convert an object into an id following a given pattern', function () {
      var pattern = 'country:city:year'
      var obj = { country: 'usa', city: 'nyc', year: '2016' }
      var id = 'usa:nyc:2016'
      expect(smartId.idify(obj, pattern)).toBe(id)
    })
    it('accepts optional fields in the pattern', function () {
      var pattern = 'country:city:year:?month'
      var partialId = 'usa:nyc:2016'
      var partialObj = { country: 'usa', city: 'nyc', year: '2016' }
      var fullId = 'usa:nyc:2016:03'
      var fullObj = { country: 'usa', city: 'nyc', year: '2016', month: '03' }
      expect(smartId.idify(partialObj, pattern)).toBe(partialId)
      expect(smartId.idify(fullObj, pattern)).toBe(fullId)
    })
    it('does not accept non optional fields after optional fields', function () {
      var id = 'usa:nyc:2016:03:06'
      var pattern = 'country:city:year:?month:week'
      expect(smartId.idify.bind(null, id, pattern)).toThrow()
    })
    it('fails if no value provided for non optional fields', function () {
      var pattern = 'country:city:year:week'
      var obj = { country: 'usa', city: 'nyc', year: '2016' }
      expect(smartId.idify.bind(null, obj, pattern)).toThrow()
    })
  })
})
