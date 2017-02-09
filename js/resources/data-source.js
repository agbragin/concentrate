angular.module('ghop-ui')
.factory('DataSource', $resource => $resource('/dataSources/:id', { id: '@id' }));