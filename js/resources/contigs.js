angular.module('ghop-ui')
.factory('Contigs', $resource => $resource('/ghop-core/references/:id', { id: '@id' }));