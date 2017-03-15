angular.module('ghop-ui')
.factory('ReferenceServiceSelector', $resource => $resource('/referenceService?type=:type', { type: '@type' }, {
    toggle: { method: 'POST' }
}));