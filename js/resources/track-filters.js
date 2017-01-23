angular.module('ghop-ui')
.factory('TrackFilters', $resource => $resource('/ghop-core/tracks/:id/filters', { id: '@id' }));