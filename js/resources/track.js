angular.module('ghop-ui')
.factory('Track', $resource => $resource('/ghop-core/tracks/:id', { id: '@id' }));