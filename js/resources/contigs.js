angular.module('ghop-ui')
.factory('Contigs', $resource => $resource('/references/:id', { id: '@id' }));