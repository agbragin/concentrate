angular.module('ghop-ui')
.factory('TrackDataSource', $resource => $resource('/ghop-core/tracks/:id/dataSource', { id: '@id' }));