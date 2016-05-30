(function (angular) {
  'use strict';

  angular = 'default' in angular ? angular['default'] : angular;

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  var parsePattern = function parsePattern(pattern, separator) {
    var parsePatternField = function parsePatternField(field) {
      var parsed = {
        key: field,
        isOptional: false
      };

      var splitted = field.split('?');
      if (splitted[0] === '') {
        parsed.key = splitted[1];
        parsed.isOptional = true;
      }

      return parsed;
    };

    return pattern.split(separator).map(parsePatternField);
  };

  var validate = function validate(parsedPatternFields) {
    var wasOptional = false;

    parsedPatternFields.forEach(function (field, index) {
      if (field.isOptional) {
        wasOptional = true;
      } else if (wasOptional) {
        throw new Error('invalid pattern: ' + parsedPatternFields[index - 1].key + ' is optional, but is followed by non optional field ' + field.key);
      }
    });
  };

  var SmartIdService = function () {
    function SmartIdService($injector) {
      babelHelpers.classCallCheck(this, SmartIdService);

      try {
        this.separator = $injector.get('ngSmartIdSeparator');
      } catch (e) {
        this.separator = ':';
      }

      try {
        this.patterns = $injector.get('ngSmartIdPatterns');
      } catch (e) {
        this.patterns = {};
      }
    }

    babelHelpers.createClass(SmartIdService, [{
      key: 'parse',
      value: function parse(id, pattern) {
        pattern = this.patterns[pattern] || pattern;
        var idFields = id.split(this.separator);
        var patternFields = parsePattern(pattern, this.separator);
        validate(patternFields);

        var result = idFields.reduce(function (parsed, value) {
          var key = patternFields.shift().key;
          parsed[key] = value;
          return parsed;
        }, {});

        if (patternFields.length) {
          var next = patternFields[0];
          if (!next.isOptional) {
            throw new Error('could not parse the id, non optional field ' + next.key + ' missing');
          }
        }

        return result;
      }
    }, {
      key: 'idify',
      value: function idify(object, pattern) {
        var _this = this;

        var isValid = function isValid(value) {
          return typeof value !== 'undefined' && value !== null && value !== '';
        };

        Object.keys(object).forEach(function (key) {
          if (!isValid(object[key])) {
            delete object[key];
          }
        });

        pattern = this.patterns[pattern] || pattern;
        var patternFields = parsePattern(pattern, this.separator);
        validate(patternFields);

        var nbGivenFields = Object.keys(object).length;
        var nbMissingFields = patternFields.length - nbGivenFields;
        if (nbMissingFields > 0) {
          var optionalFields = patternFields.splice(nbGivenFields);
          optionalFields.forEach(function (field) {
            if (!field.isOptional) {
              throw new Error('could not generate id, missing field ' + field.key);
            }
          });
        }

        return patternFields.splice(0, nbGivenFields).reduce(function (id, field) {
          var value = object[field.key];
          return id + (id.length ? _this.separator + value : value);
        }, '');
      }
    }]);
    return SmartIdService;
  }();

  angular.module('ngSmartId', []).service('smartId', SmartIdService);

}(angular));