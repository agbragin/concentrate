class AttributeService {

    constructor(Attributes, Attribute) {
        this._repository = {
            findAll: () => Attributes.get(),
            getOne: id => Attribute.get({ id: id })
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
.factory('AttributeService', AttributeService);