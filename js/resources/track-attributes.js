angular.module('ghop-ui')
.factory('TrackAttributes', $resource => $resource('/tracks/:id/attributes', { id: '@id' }));