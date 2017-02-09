class HateoasException {

    /**
     * @constructor
     * @this {HateoasException}
     * @param {Object} resource Resource caused the exception
     * @param {String} message Exception message
     */
    constructor(resource, message) {
        this._resource = resource;
        this._message = message;
    }

    get resource() { return this._resource }
    get message()  { return this._message  }
}

class HateoasUtils {

    /**
     * @static {HateoasUtils}
     * @param {Object} resource HATEOAS-resource
     * @returns {String} Resource's self-link
     * @throws {HateoasException} if the resource is not a HATEOAS-resource
     */
    static getResourceUri(resource) {

        if (resource && resource['_links'] && resource['_links'].self
                && resource['_links'].self.href) {
            return new String(resource['_links'].self.href);
        } else {
            throw new HateoasException(resource, 'Is not a HATEOAS-resource');
        }
    }

    /**
     * @static {HateoasUtils}
     * @param {Object} resource HATEOAS-resource
     * @returns {String} Resource's id
     * @throws {HateoasException} if the resource is not a HATEOAS-resource
     */
    static getResourceId(resource) {

        let resourceUri = HateoasUtils.getResourceUri(resource);
        let uriTokens = resourceUri.split('/');

        return uriTokens[uriTokens.length - 1];
    }
}

angular.module('ghop-ui')
.constant('HateoasUtils', HateoasUtils);