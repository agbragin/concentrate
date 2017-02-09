angular.module('ghop-ui')
.factory('Attribute', $resource => $resource('/attributes/:id', { id: '@id' }));