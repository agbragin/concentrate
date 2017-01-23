angular.module('ghop-ui')
.factory('DataSource', $resource => $resource('/ghop-core/dataSources/:id', { id: '@id' }));