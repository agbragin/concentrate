angular.module('ghop-ui')
.factory('TrackDataSource', $resource => $resource('/tracks/:id/dataSource', { id: '@id' }));