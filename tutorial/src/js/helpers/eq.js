const Handlebars = require('handlebars');

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('lookup', function(array, index) {
  return array[index];
});
