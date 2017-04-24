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

class ReferenceGenomeService {

    constructor($log, DataSourceTypes, ReferenceGenomes, Contigs, HateoasUtils) {

        this._referenceGenomes = ReferenceGenomes.get;
        this._contigsResource = Contigs;
        this._hateoasUtils = HateoasUtils;
        this._dataSourceTypes = DataSourceTypes.get;
    }

    get referenceGenomeIds() { 
        return this._referenceGenomes().$promise
                    .then(genomes => genomes['_embedded'].referenceGenomes.map(genome => genome.id)); 
    }

    get contigsMapping () {
       return  this.referenceGenomeIds.then(ids => Promise.all(ids.map(id => this._contigsResource.get({ id: id }).$promise
                            .then(resource => [this._hateoasUtils.getResourceId(resource), resource['contigs']]))))
                    .then(mappings => mappings.reduce((map, mapping) => {
                        map[mapping[0]] = mapping[1];
                        return map;
                    }, {}));
    }

    get dataSourceTypes    () { return this._dataSourceTypes().$promise }
}

angular.module('ghop-ui')
.factory('ReferenceGenomeService', ($log, DataSourceTypes, ReferenceGenomes, Contigs, HateoasUtils) =>
        new ReferenceGenomeService($log, DataSourceTypes, ReferenceGenomes, Contigs, HateoasUtils));
