angular.module('ghop-ui')
.factory('ReferenceTrack', $resource => $resource('/tracks?genome=:id', { id: '@id' }, {
    select: { method: 'POST' }
}));