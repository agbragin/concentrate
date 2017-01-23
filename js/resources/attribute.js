angular.module('ghop-ui')
.factory('Attribute', $resource => $resource('/ghop-core/attributes/:id', { id: '@id' }));