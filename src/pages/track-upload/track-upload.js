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
.controller('TrackUploadPageController', ['$scope', '$state', '$rootScope', 'TrackService',
        function($scope, $state, $rootScope, TrackService) {

    const unavailableTypes = Array.of('REFERENCE', 'CHROMOSOME');
    const featureFileTypes = Array.of('GFF', 'INDEXED_GFF');
    const indexedTypes = Array.of('INDEXED_GFF');

    // TODO: this function is subject of change during the development
    $scope.unavailableType = type => unavailableTypes.concat(indexedTypes).indexOf(type) !== -1;
    $scope.isFeatureFileType = type => featureFileTypes.indexOf(type) !== -1;
    $scope.isIndexedType = type => indexedTypes.indexOf(type) !== -1;

    $scope.upload = () => {
        TrackService.createFromLocalFile($scope.name, $scope.type,
                        encodeURIComponent($scope.file),
                        $scope.isFeatureFileType($scope.type) ? encodeURIComponent($scope.specFile) : undefined)
                .then(() => $scope.goBack());
    };

    $scope.goBack = () => $state.go($rootScope.applicationStates.get('browserView'));
}]);