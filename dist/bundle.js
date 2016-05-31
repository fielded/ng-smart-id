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
        var idFields = id.split(this.separator);

        var key = void 0;
        var result = idFields.reduce(function (parsed, field) {
          if (!key) {
            key = field;
          } else {
            parsed[key] = field;
            key = undefined;
          }
          return parsed;
        }, {});

        if (pattern) {
          pattern = this.patterns[pattern] || pattern;
          var patternFields = parsePattern(pattern, this.separator);

          patternFields.forEach(function (field) {
            if (!result[field.key] && !field.isOptional) {
              throw new Error('could not parse the id, non optional field ' + field.key + ' missing');
            }
          });
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

        pattern = this.patterns[pattern] || pattern;
        var patternFields = parsePattern(pattern, this.separator);

        return patternFields.reduce(function (id, field) {
          var value = object[field.key];
          if (value && isValid(value)) {
            return id + (id.length ? _this.separator + field.key : field.key) + _this.separator + value;
          } else {
            if (!field.isOptional) {
              throw new Error('could not generate id, missing field ' + field.key);
            }
            return id;
          }
        }, '');
      }
    }]);
    return SmartIdService;
  }();

  angular.module('ngSmartId', []).service('smartId', SmartIdService);

}(angular));