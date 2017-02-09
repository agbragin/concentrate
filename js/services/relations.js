angular.module('ghop-ui')
.factory('RelationsService', 
    ['$log', 'SVGDrawer', 'TrackUtils', 'CanvasSettings', ($log, SVGDrawer, TrackUtils, CanvasSettings) => {

    class RelationsService {

        constructor(arrowsContainerSelector, imagesContainerSelector, idFieldName = 'id') {

            this._collection = [];
            this._idFieldName = idFieldName;
            this._operation = 'AND';
            this._drawer = SVGDrawer.newDrawer(arrowsContainerSelector, imagesContainerSelector);
            this._selectionMode = false;
            this._maxRelationId = 0;
            this._relations = [];
            this._itemsInRelation = [];
        }

        set collection (collection) {
            this._collection = collection;
        }

        get relations () { return this._relations }

        set relations (relations) {
            this._relations = relations;
            this._maxRelationId = 0;
            this._relations.forEach(relation => {
                this._maxRelationId = Math.max(this._maxRelationId, relation.id);
            });
        }

        addToRelation (item, collection) {

            if (!this._selectionMode) {
                return;
            }

            let relationItem = false;

            
            this._relations.forEach(rel => {
                
                if (TrackUtils.indexOf(rel.items, item, this._idFieldName) !== -1) {
                    return (relationItem = rel);
                }
            });

            if (relationItem === false) {
                return;
            }
            
            this._itemsInRelation.push(relationItem);

            if (this._itemsInRelation.length === 2) {
                
                let firstRelation = this._itemsInRelation[0],
                    secondRelation = this._itemsInRelation[1],
                    lvlA = firstRelation.lvl,
                    lvlB = secondRelation.lvl,
                    i = TrackUtils.indexOf(collection, firstRelation.items[0], this._idFieldName),
                    j = TrackUtils.indexOf(collection, secondRelation.items[0], this._idFieldName);
                
                if (i === -1 || j === -1) return;
                
                let from = Math.max(i, j);
                let to = i < j ? (i + firstRelation.items.length) : (j + secondRelation.items.length);
                let count = i < j ? firstRelation.items.length : secondRelation.items.length;
                collection.splice(to, 0, ...collection.splice(from, count));

                let readyRelation = {
                    first: firstRelation.id,
                    second: secondRelation.id,
                    type: this._operation,
                    lvl: Math.max(lvlA, lvlB) + 1,
                    id: ++this._maxRelationId,
                    items: firstRelation.items.concat(secondRelation.items)
                };

                this._relations.push(readyRelation);
                this._selectionMode = false;

                this._drawer.draw(this._relations, collection, this._idFieldName);
                
                this._itemsInRelation = [];
            }
        };

        updateRelations (collection) {
            this._drawer.draw(this._relations, collection, this._idFieldName);
        };

        addRelation (firstId, secondId, type, lvl, items) {

            this._relations.push({
                first: firstId,
                second: secondId,
                type: type,
                lvl: lvl,
                id: ++this._maxRelationId,
                items: items
            });
        };

        defaultRelations () {

            this._itemsInRelation = [];
            this._selectionMode = false;
            this._maxRelationId = 0;
            this._relations = this._relations.filter(rel => rel.type === 'SINGLE');
            this._relations.forEach(relation => {
                this._maxRelationId = Math.max(this._maxRelationId, relation.id);
            });
            this._drawer.clearAll();
        };

        isSelected (item) {

            let alreadySelected = false;
            this._itemsInRelation.forEach(relation => {
                relation.items.forEach(f => {
                    if (f[this._idFieldName] === item[this._idFieldName]) {
                        alreadySelected = true;
                        return;
                    }
                });
            });

            return alreadySelected;
        };

        createRelation (type) {
            this._operation = type;
            this._selectionMode = true;
        };

        isSelectable (item) {

            let alreadySelected = false;

            this._itemsInRelation.forEach(relation => {
                relation.items.forEach(f => {
                    if (f[this._idFieldName] === item[this._idFieldName]) {
                        alreadySelected = true;
                        return;
                    }
                });
            });

            return this._selectionMode;
        };
    }

    return {
        newInstance: (arrowsContainerSelector, imagesContainerSelector, idFieldName) => new RelationsService(arrowsContainerSelector, imagesContainerSelector, idFieldName)
    };
}]);