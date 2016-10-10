var Handlebars = require('handlebars');

Handlebars.registerHelper('ifCond', function(v1, operator, v2, regExFlag, options) {
  if (options == null && regExFlag) {
    options = regExFlag;
    regExFlag = null;
  }

  if (regExFlag == null) {
    regExFlag = 'i';
  }

  switch (operator) {
    // case '==':
    //   return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    case 'regex':
      return ((v1 || '').match(new RegExp(v2 || '', regExFlag))) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});
