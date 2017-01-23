angular.module('ghop-ui')
.factory('TrackAttributes', $resource => $resource('/ghop-core/tracks/:id/attributes', { id: '@id' }));