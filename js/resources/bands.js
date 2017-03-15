angular.module('ghop-ui')
.factory('Bands', $resource => $resource('/bands?contig=:contig&coord=:coord&left=:left&right=:right&dataSources=:dataSources', {
    contig: '@contig',
    coord: '@coord',
    left: '@left',
    right: '@right',
    dataSources: '@dataSources'
}));