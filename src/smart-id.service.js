const parsePattern = (pattern, separator) => {
  const parsePatternField = (field) => {
    let parsed = {
      key: field,
      isOptional: false
    }

    const splitted = field.split('?')
    if (splitted[0] === '') {
      parsed.key = splitted[1]
      parsed.isOptional = true
    }

    return parsed
  }

  return pattern
          .split(separator)
          .map(parsePatternField)
}

const validate = (parsedPatternFields) => {
  let wasOptional = false

  parsedPatternFields.forEach((field, index) => {
    if (field.isOptional) {
      wasOptional = true
    } else if (wasOptional) {
      throw new Error('invalid pattern: ' + parsedPatternFields[index - 1].key + ' is optional, but is followed by non optional field ' + field.key)
    }
  })
}

export default class SmartIdService {
  constructor ($injector) {
    try {
      this.separator = $injector.get('ngSmartIdSeparator')
    } catch (e) {
      this.separator = ':'
    }

    try {
      this.patterns = $injector.get('ngSmartIdPatterns')
    } catch (e) {
      this.patterns = {}
    }
  }

  parse (id, pattern) {
    pattern = this.patterns[pattern] || pattern
    const idFields = id.split(this.separator)
    const patternFields = parsePattern(pattern, this.separator)
    validate(patternFields)

    let result = idFields.reduce((parsed, value) => {
      const key = patternFields.shift().key
      parsed[key] = value
      return parsed
    }, {})

    if (patternFields.length) {
      const next = patternFields[0]
      if (!next.isOptional) {
        throw new Error('could not parse the id, non optional field ' + next.key + ' missing')
      }
    }

    return result
  }

  idify (object, pattern) {
    pattern = this.patterns[pattern] || pattern
    const patternFields = parsePattern(pattern, this.separator)
    validate(patternFields)

    const nbGivenFields = Object.keys(object).length
    const nbMissingFields = patternFields.length - nbGivenFields
    if (nbMissingFields > 0) {
      const optionalFields = patternFields.splice(nbGivenFields)
      optionalFields.forEach((field) => {
        if (!field.isOptional) {
          throw new Error('could not generate id, missing field ' + field.key)
        }
      })
    }

    return patternFields.splice(0, nbGivenFields).reduce((id, field) => {
      const value = object[field.key]
      return id + (id.length ? this.separator + value : value)
    }, '')
  }
}
