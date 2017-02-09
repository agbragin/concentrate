class TrackService {

    constructor(Tracks, Track, TrackAttributes, TrackDataSource, TrackFilters) {

        this._repository = {
            findAll: () => Tracks.get(),
            removeAll: () => Tracks.remove(),
            createFromFile: (file, track, type, genome) => {

                let fd = new FormData();
                fd.append('file', file);
                fd.append('track', track);
                fd.append('type', type);
                fd.append('genome', genome);

                return Tracks.createFromFile(fd);
            },
            getOne: id => Track.get({ id: id }),
            removeOne: id => Track.remove({ id: id }),
            getAttributes: id => TrackAttributes.get({ id: id }),
            getDataSource: id => TrackDataSource.get({ id: id }),
            getFilters: id => TrackFilters.get({ id: id })
        }
    }

    findAll() {
        return this._repository.findAll().$promise;
    }

    removeAll() {
        return this._repository.removeAll().$promise;
    }

    createFromFile(file, track, type, genome) {
        return this._repository.createFromFile(file, track, type, genome).$promise;
    }

    getOne(id) {
        return this._repository.getOne(id).$promise;
    }

    removeOne(id) {
        return this._repository.removeOne(id).$promise;
    }

    getAttributes(id) {
        return this._repository.getAttributes(id).$promise;
    }

    getDataSource(id) {
        return this._repository.getDataSource(id).$promise;
    }

    getFilters(id) {
        return this._repository.getFilters(id).$promise;
    }
}

angular.module('ghop-ui')
.factory('TrackService', (Tracks, Track, TrackAttributes, TrackDataSource, TrackFilters) => new TrackService(Tracks, Track, TrackAttributes, TrackDataSource, TrackFilters));