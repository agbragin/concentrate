angular.module('ghop-ui')
.factory('Track', $resource => $resource('/tracks/:id', { id: '@id' }));