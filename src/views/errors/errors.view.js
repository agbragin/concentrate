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
.controller('ErrorsViewController', ['$rootScope', '$scope', '$state', 'FailedRequests', 'FailedRequestService', 'RoutingConfig',
        function($rootScope, $scope, $state, FailedRequests, FailedRequestService, RoutingConfig) {

    $scope.failedRequests = FailedRequests;

    $scope.flushErrors = () => FailedRequestService.flush();

    $scope.goBack = () => $state.go($rootScope.previousState.name || RoutingConfig.states.get('browser'), $rootScope.previousState.params);
}]);