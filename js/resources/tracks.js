angular.module('ghop-ui')
.factory('Tracks', $resource => $resource('/ghop-core/tracks', {}, {
    createFromFile: {
        method: 'POST',
        headers: {
            'Content-Type': undefined
        },
        transformRequest: angular.identity
    }
}));