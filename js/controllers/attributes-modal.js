angular.module('ghop-ui')
.controller('AttributesModalController', 
    ['$log', '$scope', '$timeout', '$uibModalInstance', 'CanvasSettings', 'RelationsService', 'track',
    ($log, $scope, $timeout, $uibModalInstance, CanvasSettings, RelationsService, track) => {

    $scope.track = track;

    $scope.relationService = RelationsService.newInstance('#filters_tree', '#filters_images', 'id');

    $scope.refreshSlider = () => {
        $timeout(() => {
            $scope.$broadcast('rzSliderForceRender');
        });
    };

    $scope.onAddRelationCallback = () => {
        let lvl = $scope.relationService.maxLvl;
        let svgWidth = lvl * CanvasSettings.SVG_TREE_LVL_WIDTH + CanvasSettings.SVG_TREE_RIGHT_PADDING;
        $('.modal-dialog').width(CanvasSettings.FILTERS_MODAL_MIN_WIDTH + svgWidth);
        $('.modal-dialog svg').width(svgWidth);
    };

    $scope.getSliderOptions = attribute => {
        
        let boundType;
        return {
            disabled: attribute.disabled, 
            floor: attribute.range.lowerBound, 
            ceil: attribute.range.upperBound,
            precision:2, 
            step: 0.01, 
            translate: (value, sliderId, label) => {
                switch (label) {
                    case 'model':
                        boundType = attribute.operators[0] ? '[' : '(';
                        return boundType + value;
                    case 'high':
                        boundType = attribute.operators[1] ? ']' : ')';
                        return value + boundType;
                    default:
                        return value
                }
            }
        }
    };

    $scope.relationService.collection = track.attributes;

    if ($scope.track.relations !== undefined && $scope.track.relations.length > 0) {
        $scope.track.relations.forEach(relation => {
            $scope.relationService.relations.push(
                $scope.relationService.createRelation(relation.first, relation.second, relation.type, relation.lvl, relation.items)
            );
        });

        // draw relations graph after DOM loading
        $timeout(() => {
            $scope.relationService.updateRelations(track.attributes);
            $scope.onAddRelationCallback();
        }, 0);
    } else {
        $scope.track.attributes.forEach(attr => {
            $scope.relationService.relations.push(
                $scope.relationService.createRelation(attr.id, undefined, 'SINGLE', 0, [attr])
            );

            // Float attributes visualized as two filters: low bound and high bound
            if (attr.type === 'FLOAT') {
                $scope.relationService.relations.push(
                    $scope.relationService.createRelation(attr.id, undefined, 'SINGLE', 0, [attr])
                );
                
                if (attr.operators === undefined) {
                    // Both - low bound and high bound - have inclusive range by default
                    attr.operators = [true,true];
                }
            }
        });
    }
    

    $scope.cancel = () => $uibModalInstance.dismiss('cancel');

    $scope.save = () => {
        console.info(`Filters have been saved`);

        let filtersArr = [],
            filters = [],
            aggregates = [];

        $scope.track.attributes
            .filter(attribute => (attribute.value !== undefined && attribute.value !== null && !attribute.disabled))
            .map(attribute => {

                let values = Array.isArray(attribute.value) ? attribute.value : [ attribute.value ];
                let relation = $scope.relationService.relations.find(rel => rel.first === attribute.id);

                // Float attributes visualized as two filters: low bound and high bound
                if (attribute.type === 'FLOAT') {
                    let secondRelation = $scope.relationService.relations.find(rel => (rel.first === attribute.id && relation.id !== rel.id));
                    filters.push({
                        id: relation.id,
                        attribute: attribute.id,
                        operator: attribute.operators[0] ? '>=' : '>',
                        values: [values[0]]
                    });
                    filters.push({
                        id: secondRelation.id,
                        attribute: attribute.id,
                        operator: attribute.operators[1] ? '<=' : '<',
                        values: [values[1]]
                    });
                } else {
                    filters.push({
                        id: relation.id,
                        attribute: attribute.id,
                        operator: attribute.filterOperator,
                        values: values
                    });
                }                
            });

        $scope.track.relations = $scope.relationService.relations;

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