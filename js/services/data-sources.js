class DataSourceService {

    constructor(DataSources, DataSource) {
        this._repository = {
            findAll: () => DataSources.get(),
            getOne: id => DataSource.get({ id: id })
        }
    }

    findAll() {
        return this._repository.findAll().$promise;
    }

    getOne(id) {
        return this._repository.getOne(id).$promise;
    }
}

angular.module('ghop-ui')
.factory('DataSourceService', DataSourceService);