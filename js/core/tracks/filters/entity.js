class TrackFilterEntity {

    /**
     * @this
     * @constructor
     * @param {AttributeAggregate} query
     */
    constructor(query) {

        this.filters = [];
        this.aggregates = [];

        this.aggregates.push(this._constructAggregate(query));
    }

    _constructAggregate (query) {

        let entities = [];
        if (query.filters && query.filters.length) {
            entities = query.filters.map(TrackFilterEntity.buildFilter);
            this.filters = this.filters.concat(entities);
        }

        if (query.aggregates && query.aggregates.length) {

            for (let i = 0; i < query.aggregates.length; ++i) {

                let aggregateEntity = this._constructAggregate(query.aggregates[i]);
                this.aggregates.push(aggregateEntity);
                entities.push(aggregateEntity);
            }
        }

        return TrackFilterEntity.buildAggregate(entities, query.operator);
    }

    static buildFilter (filter) {
        return new AttributeFilterEntity(TrackFilterEntity.idGenerator.next().value, filter.attribute.id, filter.operator, filter.values, filter.includeNulls);
    }

    static buildAggregate (entities, operator) {
        return new AttributeAggregateEntity(TrackFilterEntity.idGenerator.next().value, entities.map(it => it.id), operator);
    }

    static idGenerator = TrackFilterEntity.id();

    static * id () {

        let id = 0;
        while (true) {
            yield id++;
        }
    }
}