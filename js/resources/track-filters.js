angular.module('ghop-ui')
.factory('TrackFilters', $resource => $resource('/tracks/:id/filters', { id: '@id' }));