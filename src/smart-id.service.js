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
    const idFields = id.split(this.separator)

    let key
    let result = idFields.reduce((parsed, field) => {
      if (!key) {
        key = field
      } else {
        parsed[key] = field
        key = undefined
      }
      return parsed
    }, {})

    if (pattern) {
      pattern = this.patterns[pattern] || pattern
      const patternFields = parsePattern(pattern, this.separator)

      patternFields.forEach((field) => {
        if (!result[field.key] && !field.isOptional) {
          throw new Error('could not parse the id, non optional field ' + field.key + ' missing')
        }
      })
    }

    return result
  }

  idify (object, pattern) {
    const isValid = (value) => {
      return typeof value !== 'undefined' && value !== null && value !== ''
    }

    pattern = this.patterns[pattern] || pattern
    const patternFields = parsePattern(pattern, this.separator)

    return patternFields.reduce((id, field) => {
      const value = object[field.key]
      if (value && isValid(value)) {
        return id + (id.length ? this.separator + field.key : field.key) + this.separator + value
      } else {
        if (!field.isOptional) {
          throw new Error('could not generate id, missing field ' + field.key)
        }
        return id
      }
    }, '')
  }
}
