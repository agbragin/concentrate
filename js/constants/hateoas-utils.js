class HateoasException {

    constructor(resource, message) {
        this._resource = resource;
        this._message = message;
    }

    get resource() { return this._resource }
    get message()  { return this._message  }
}

class HateoasUtils {

    constructor() {}

    getResourceUri(resource) {

        if (resource && resource['_links'] && resource['_links'].self
                && resource['_links'].self.href) {
            return new String(resource['_links'].self.href);
        } else {
            throw new HateoasException(resource, 'Is not a HATEOAS-resource');
        }
    }

    getResourceId(resource) {

        let resourceUri = this.getResourceUri(resource);
        let uriTokens = resourceUri.split('/');

        return uriTokens[uriTokens.length - 1];
    }
}

angular.module('ghop-ui')
.constant('HateoasUtils', new HateoasUtils());