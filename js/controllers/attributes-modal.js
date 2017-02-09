angular.module('ghop-ui')
.controller('AttributesModalController', 
    ['$log', '$scope', '$uibModalInstance', 'RelationsService', 'track',
    ($log, $scope, $uibModalInstance, RelationsService, track) => {

    $scope.track = track;

    $scope.relationService = RelationsService.newInstance('#filters_tree', '#filters_images', 'id');

    $scope.track.attributes.forEach(filter => {
        $scope.relationService.addRelation(filter.id, undefined, 'SINGLE', 0, [filter]);
    });
    $scope.relationService.collection = track.attributes;

    $scope.cancel = () => $uibModalInstance.dismiss('cancel');

    $scope.save = () => {

        console.info(`Filters has been saved`);
        console.debug($scope.relationService.relations);

        let filtersArr = [],
            filters = [],
            aggregates = [];

        $scope.track.attributes
            .filter(attribute => (attribute.value !== undefined && attribute.value !== null && !attribute.disabled))
            .map(attribute => {

                let values = Array.isArray(attribute.value) ? attribute.value : [ attribute.value ];
                let relation = $scope.relationService.relations.find(rel => rel.first === attribute.id);

                filters.push({
                    id: relation.id,
                    attribute: attribute.id,
                    operator: attribute.filterOperator,
                    values: values
                });
            });

        $scope.relationService.relations
            .filter(relation => relation.items.length > 1)
            .map(relation =>  {
                aggregates.push({
                    id: relation.id,
                    filters: [
                        relation.first,
                        relation.second
                    ],
                    operator: relation.type
                });
            });

        let filter = {
            filters,
            aggregates
        };

        $uibModalInstance.close(filter);
    }
}]);