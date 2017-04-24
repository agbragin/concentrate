/*******************************************************************************
 *     Copyright 2016-2017 the original author or authors.
 *
 *     This file is part of CONC.
 *
 *     CONC. is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     CONC. is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with CONC. If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/

angular.module('ghop-ui')
.directive('filterQuery', () => {

    return {
        restrict: 'E',
        scope: {
            query: '=',
            parent: '='
        },
        controller: ($rootScope, $log, $scope, $uibModal) => {

            $scope.emptyFilter = () => !($scope.query.filters.length || $scope.query.aggregates.length);

            $scope.handleCtxClick = () => {

                if ($rootScope.attributeFilterToAdd) {

                    $log.debug('Adding filter to subcontext');

                    $scope.query.addFilter($rootScope.attributeFilterToAdd);
                    $rootScope.attributeFilterToAdd = undefined;
                }
            };

            $scope.ctxStyle = operator => {
                switch (operator) {
                    case 'AND':
                        return 'ctx-and';

                    case 'OR':
                        return 'ctx-or';

                    case 'XOR':
                        return 'ctx-xor';

                    default:
                }
            };

            $scope.filterOpts = [
                ['Put into context', () => {}, [
                    ['AND', $itemScope => $scope.putInto('AND', $itemScope.filter)],
                    ['OR', $itemScope => $scope.putInto('OR', $itemScope.filter)],
                    ['XOR', $itemScope => $scope.putInto('XOR', $itemScope.filter)]
                ]],
                null,
                ['Remove', $itemScope => $scope.removeFilter($itemScope.filter)]
            ];

            $scope.aggregateOpts = [
                ['Switch context', () => {}, [
                    ['AND', $itemScope => $scope.switchCtx($itemScope.$parent.query, 'AND')],
                    ['OR', $itemScope => $scope.switchCtx($itemScope.$parent.query, 'OR')],
                    ['XOR', $itemScope => $scope.switchCtx($itemScope.$parent.query, 'XOR')]
                ]],
                ['Unfold', $itemScope => {
                    $scope.unfoldCtx($itemScope.$parent.query);
                }],
                null,
                ['Remove', $itemScope => {
                    $scope.removeAggregate($itemScope.$parent.query);
                }]
            ];

            $scope.unfoldCtx = ctx => {

                if (!$scope.parent) {
                    $log.debug('Command ignored: you are trying to unfold root context');
                    return;
                }

                $scope.parent.filters = $scope.parent.filters.concat(ctx.filters);
                $scope.parent.aggregates = $scope.parent.aggregates.concat(ctx.aggregates);
                $scope.parent.aggregates.filter(it => it.operator === $scope.parent.operator).forEach(it => {

                    $scope.parent.filters = $scope.parent.filters.concat(it.filters);
                    $scope.parent.aggregates = $scope.parent.aggregates.concat(it.aggregates);

                    $log.debug(`Nested aggregate of id: ${$scope.parent.aggregates.splice($scope.parent.aggregates.indexOf(it), 1)[0].id} was unfolded`);
                });

                $log.debug(`Aggregate of id: ${$scope.parent.aggregates.splice($scope.parent.aggregates.indexOf(ctx), 1)[0].id} was unfolded`);
            };

            $scope.switchCtx = (ctx, operator) => {

                if (ctx.operator === operator) {
                    $log.debug(`Context of id: ${ctx.id} is already of type: ${operator}`);
                    return;
                }

                if ($scope.parent && $scope.parent.operator === operator) {
                    $log.debug(`Switching context of id: ${ctx.id} to the same context as it's parent's context: unfolding it`);
                    $scope.unfoldCtx(ctx);
                } else {

                    ctx.operator = operator;
                    ctx.aggregates.filter(it => it.operator === operator).forEach(it => {

                        ctx.filters = ctx.filters.concat(it.filters);
                        ctx.aggregates = ctx.aggregates.concat(it.aggregates);

                        $log.debug(`Nested aggregate of id: ${ctx.aggregates.splice(ctx.aggregates.indexOf(it), 1)[0].id} was unfolded`);
                    });
                }
            };

            $scope.putInto = (ctx, filter) => {

                if ($scope.query.operator === ctx) {
                    $log.debug(`Filter ${filter.attribute.name} is already in ${ctx} context`);
                    return;
                }

                let idx = $scope.query.filters.indexOf(filter);
                if (idx !== -1) {
                    $scope.query.aggregates.push(AttributeAggregate.build(filter, ctx));
                    $log.debug(`Filter ${$scope.query.filters.splice(idx, 1)[0].attribute.name} was put into ${ctx} context`);
                } else {
                    $log.warn(`Failed to find filter: ${filter.attribute.name}`);
                }
            };

            $scope._removeEmptyCtxs = ctx => {

                ctx.aggregates.forEach(it => {
                    let c = $scope._removeEmptyCtxs(it);
                    if (!c.filters.length && !c.aggregates.length) {
                        $log.debug(`Empty aggregate of id: ${ctx.aggregates.splice(ctx.aggregates.indexOf(c), 1)[0].id} was removed`);
                    }
                });

                return ctx;
            };

            $scope.removeFilter = filter => {

                let idx = $scope.query.filters.indexOf(filter);
                if (idx !== -1) {
                    $log.debug(`Removed ${$scope.query.filters.splice(idx, 1)[0].attribute.name} filter`);
                    $scope._removeEmptyCtxs($rootScope.rootAggregate);
                } else {
                    $log.warn(`Failed to find filter: ${filter.attribute.name}`);
                }
            };

            $scope.removeAggregate = aggregate => {

                if (!$scope.parent) {
                    $rootScope.rootAggregate = AttributeAggregate.empty('AND');
                    return;
                }

                let idx = $scope.parent.aggregates.indexOf(aggregate);
                if (idx !== -1) {
                    $log.debug(`Removed aggregate of id: ${$scope.parent.aggregates.splice(idx, 1)[0].id}`);
                    $scope._removeEmptyCtxs($rootScope.rootAggregate);
                } else {
                    $log.warn(`Failed to find aggregate of id: ${aggregate.id}`);
                }
            };

            $scope.openAttributeSelectionModal = () => {

                let modalInstance = $uibModal.open({
                    animation: true,
                    controller: 'AttributeSelectionController',
                    size: 'md',
                    resolve: {
                        attributes: () => $scope.attributes
                    },
                    templateUrl: 'templates/modals/attribute-selection.html'
                });

                modalInstance.result.then(
                    attributeFilter => $scope.query.addFilter(attributeFilter),
                    () => $log.debug('Attribute selection modal window dismissed'));
            };
        },
        templateUrl: 'templates/directives/filter-query.html'
    }
});