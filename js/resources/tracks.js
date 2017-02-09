angular.module('ghop-ui')
.factory('Tracks', $resource => $resource('/tracks', {}, {
    createFromFile: {
        method: 'POST',
        headers: {
            'Content-Type': undefined
        },
        transformRequest: angular.identity
    }
}));