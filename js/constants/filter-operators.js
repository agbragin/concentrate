angular.module('ghop-ui')
.constant('FilterOperator', {
    LESS: '<',
    LESSEQ: '<=',
    GREATEREQ: '>=',
    GREATER: '>',
    LIKE: '~',
    ILIKE: '~*',
    EQUALS: '=',
    NOTEQUALS: '!=',
    IN: '|'
});