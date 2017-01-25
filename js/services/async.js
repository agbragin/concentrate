class AsyncService {

    constructor($rootScope, $log) {

        this._asyncHandle = async (req, callback) => {

            try {
                callback(await req);
            } catch (e) {
                $log.error(e);
            } finally {
                $rootScope.$apply();
            }
        }
    }

    get asyncHandle () { return this._asyncHandle }
}

angular.module('ghop-ui')
.factory('AsyncService', AsyncService);