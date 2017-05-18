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
 *******************************************************************************/


angular.module('concentrate')
.controller('AttributeFilterQueryController', ['$log', '$scope', 'TrackService',
        function($log, $scope, TrackService) {

    $log.debug('Attribute filter query component is running');

    let noop = (() => {})();

    $scope.filterIsEmpty = () => !($scope.query) || !($scope.query.filters.length || $scope.query.aggregates.length);

    $scope.ctxClass = () => {

        switch ($scope.query.operator) {
        case 'AND':
            return 'bg-aqua';

        case 'OR':
            return 'bg-olive';

        case 'XOR':
            return 'bg-yellow';

        default:
            $log.warn(`Aggregate of id: ${$scope.query.id} has unknown operator: ${$scope.query.operator}`);
        }
    };

    $scope.handleCtxClick = () => {

        if ($scope.builtAttributeFilter) {

            $log.debug(`Adding attribute filter to subcontext of id: ${$scope.query.id}`);

            $scope.query.addFilters($scope.builtAttributeFilter);
            $scope.builtAttributeFilter = undefined;

            $scope.$broadcast('queryUpdate');
        }
    };

    $scope.filterMenu = [
        ['Put into context', () => {}, [
            ['AND', $itemScope => $scope.putInto('AND', $itemScope.filter)],
            ['OR', $itemScope => $scope.putInto('OR', $itemScope.filter)],
            ['XOR', $itemScope => $scope.putInto('XOR', $itemScope.filter)]
        ]],
        ['Remove', $itemScope => {
            $scope.removeFilter($itemScope.filter);
        }]
    ];

    $scope.contextMenu = [
        ['Switch context', () => {}, [
            ['AND', $itemScope => $scope.switchCtx($itemScope.$parent.query, 'AND')],
            ['OR', $itemScope => $scope.switchCtx($itemScope.$parent.query, 'OR')],
            ['XOR', $itemScope => $scope.switchCtx($itemScope.$parent.query, 'XOR')]
        ]],
        ['Unfold', $itemScope => {
            $scope.unfoldCtx($itemScope.$parent.query);
        }],
        ['Remove', $itemScope => {
            $scope.removeContext($itemScope.$parent.query);
        }]
    ];

    /**
     * Function to perform context unfolding
     * 
     * @param {AttributeAggregate} context Context to unfold
     * @param {AttributeAggregate} parent Context's parent context
     */
    let unfoldContext = (context, parent) => {

        // Delegate unfolding context's content to its parent
        context.filters.length ? parent.addFilters(...context.filters) : noop;
        context.aggregates.length ? parent.addAggregates(...context.aggregates) : noop;

        /**
         * Holds aggregates from unfolding context of the same context (operator) as its parent
         * 
         * @type {Array.<AttributeAggregate>}
         */
        let hasToBeUnfold = new Array();
        parent.aggregates.filter(it => it.operator === parent.operator && it !== context).forEach(it => hasToBeUnfold.push(it));

        /**
         * Holds content from contexts, that have to be unfold
         */
        let unfoldedContent = {
            /**
             * @type {Array.<AttributeFilter>}
             */
            filters: hasToBeUnfold.map(it => it.filters).reduce((s, i) => s.concat(i), new Array()),
            /**
             * @type {Array.<AttributeAggregate>}
             */
            aggregates: hasToBeUnfold.map(it => it.aggregates).reduce((s, i) => s.concat(i), new Array())
        };

        // Delegate unfolded content to the parent context
        unfoldedContent.filters.length ? parent.addFilters(...unfoldedContent.filters) : noop;
        unfoldedContent.aggregates.length ? parent.addAggregates(...unfoldedContent.aggregates) : noop;

        // Remove aggregates, that have to be unfold, along with the original unfolding context from the parent context
        hasToBeUnfold.concat(context).forEach(it => $log.debug(`Aggregate of id: ${parent.aggregates.splice(parent.aggregates.indexOf(it), 1)[0].id} was unfolded`));
    };

    /**
     * Function to perform recursive empty context removing
     * 
     * @param {AttributeAggregate} context Root of the context hierarchy
     * @returns {AttributeAggregate}
     */
    let removeEmptyContexts = context => {

        /**
         * Holds empty context's child aggregates
         * 
         * @type {Array.<AttributeAggregate>}
         */
        let hasToBeRemoved = new Array();
        context.aggregates.forEach(it => {

            let ctx = removeEmptyContexts(it);
            if (!(ctx.filters.length || ctx.aggregates.length)) {
                $log.debug(`Empty context of id: ${context.removeAggregate(ctx).id} was removed`);
            }
        });

        return context;
    };

    /**
     * Function to perform context unfolding
     * 
     * @param {AttributeAggregate} ctx Context to be unfold
     */
    $scope.unfoldCtx = ctx => {

        if (!$scope.parent) {
            $log.debug('Command ignored: you are trying to unfold root context');
            return;
        }

        unfoldContext(ctx, $scope.parent);

        $scope.$broadcast('queryUpdate');
    };

    /**
     * Function to perform context switching
     * 
     * @param {AttributeAggregate} ctx Context to switch operator of
     * @param {string} operator New context operator
     */
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
            // Unfold context's aggregates of the same new operator
            ctx.aggregates.filter(it => it.operator === operator).forEach(it => unfoldContext(it, ctx));
        }

        $scope.$broadcast('queryUpdate');
    };

    /**
     * @param {string} ctx
     * @param {AttributeFilter} filter
     */
    $scope.putInto = (ctx, filter) => {

        if ($scope.query.operator === ctx) {
            $log.debug(`Filter ${filter.attribute.name} is already in ${ctx} context`);
            return;
        }

        $scope.query.addAggregates(AttributeAggregate.of(ctx, filter));
        $log.debug(`Filter ${$scope.query.removeFilter(filter).attribute.name} was put into ${ctx} context`);

        $scope.$broadcast('queryUpdate');
    };

    /**
     * @param {AttributeFilter} filter
     */
    $scope.removeFilter = filter => {

        $log.debug(`Removed ${$scope.query.removeFilter(filter).attribute.name} filter`);
        removeEmptyContexts($scope.origin);

        $scope.$broadcast('queryUpdate');
    };

    /**
     * @param {AttributeAggregate} context
     */
    $scope.removeContext = context => {

        if (!$scope.parent) {
            $scope.query = AttributeAggregate.empty(context.operator);
            return;
        }

        $log.debug(`Removed context of id: ${$scope.parent.removeAggregate(context).id}`);
        removeEmptyContexts($scope.origin);

        $scope.$broadcast('queryUpdate');
    };
}]);