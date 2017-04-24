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

angular.module('ghop-ui')
.factory('RelationsService', 
    ['$log', 'SVGDrawer', 'TrackUtils', 'CanvasSettings', ($log, SVGDrawer, TrackUtils, CanvasSettings) => {

    class Relation {

        constructor(id, firstId, secondId, type, lvl, items) {
            this._first = firstId;
            this._second = secondId,
            this._type = type,
            this._lvl = lvl,
            this._id = id,
            this._items = items
        }

        get id     () { return this._id     }
        get first  () { return this._first  }
        get second () { return this._second }
        get type   () { return this._type   }
        get lvl    () { return this._lvl    }
        get items  () { return this._items  }

        toJson() {

            return {
                'id': this._id,
                'filters': [
                    this._first,
                    this._second,
                ],
                'operator': this._type
            }
        }
    }
    
    class RelationsService {

        constructor(arrowsContainerSelector, imagesContainerSelector, idField = 'id') {

            this._collection = [];
            this._idField = idField;
            this._operation = 'AND';
            this._drawer = SVGDrawer.newDrawer(arrowsContainerSelector, imagesContainerSelector);
            this._selectionMode = false;
            this._maxId = 0;
            this._maxLvl = 0;
            this._relations = [];
            this._selection = [];
            this._highlighted = [];
        }

        set collection (collection) {
            this._collection = collection;
        }

        get relations () { return this._relations }
        get maxLvl () { return this._maxLvl }

        set relations (relations) {
            this._relations = relations;
            this._maxRelationId = 0;
            this._relations.forEach(relation => {
                this._maxRelationId = Math.max(this._maxRelationId, relation.id);
            });
        }        

        createRelation(firstId, secondId, type, lvl, items) {
            this._maxId++;
            this._maxLvl = Math.max(this._maxLvl, lvl);
            return new Relation(this._maxId, firstId, secondId, type, lvl, items);
        }

        _createRelationFromSelection(selection) {

            let first = selection[0],
                second = selection[1],
                lvlA = first.lvl,
                lvlB = second.lvl;

            return this.createRelation(
                    first.id, 
                    second.id, 
                    this._operation, 
                    Math.max(lvlA, lvlB) + 1,
                    first.items.concat(second.items));
        }

        _getRelationByItem(item) {

            let relation;
            let relLvl = 0;
            this._relations.forEach(rel => {
                let r = rel.items.find(el => el[this._idField] === item[this._idField]);
                if (r !== undefined && rel.lvl >= relLvl) {
                    relLvl = rel.lvl;
                    relation = rel;
                }
            });
            return relation;
        }

        addToSelection (item, collection, onChangeOrderCallback, onAddRelationCallback) {
            
            if (!this._selectionMode || this.checkInRelation(item) || item.disabled === true) {
                return;
            }
            
            this._selection.push(this._getRelationByItem(item));

            if (this._selection.length === 2) {
                let first = this._selection[0],
                    second = this._selection[1],
                    i = collection.findIndex(el => el[this._idField] === first.items[0][this._idField]),
                    j = collection.findIndex(el => el[this._idField] === second.items[0][this._idField]);
                
                if (i === -1 || j === -1) return;
                
                let from = Math.max(i, j);
                let to = i < j ? (i + first.items.length) : (j + second.items.length);
                let count = i < j ? first.items.length : second.items.length;
                collection.splice(to, 0, ...collection.splice(from, count));

                this._relations.push(this._createRelationFromSelection(this._selection));
                this._selectionMode = false;

                this._drawer.draw(this._relations, collection, this._idField);
                
                this._selection = [];

                if (onChangeOrderCallback !== undefined) {
                    onChangeOrderCallback(true);
                }

                if (onAddRelationCallback !== undefined) {
                    onAddRelationCallback();
                }
            }
        };

        updateRelations (collection) {
            this._drawer.draw(this._relations, collection, this._idField);
        };

        defaultRelations () {

            this._selection = [];
            this._selectionMode = false;
            this._maxRelationId = 0;
            this._maxLvl = 0;
            this._relations = this._relations.filter(rel => rel.type === 'SINGLE');
            this._relations.forEach(relation => {
                this._maxRelationId = Math.max(this._maxRelationId, relation.id);
            });
            this._drawer.clearAll();
        };

        checkInRelation (item) {
            return this._selection.indexOf(this._getRelationByItem(item)) !== -1;
        };

        startSelection (type) {
            this._operation = type;
            this._selectionMode = true;
        };

        setHighlight (item) {
            if (!this._selectionMode) return;

            this._highlighted = this._getRelationByItem(item).items;
        }

        isHighlighted (item) {
            return this._selectionMode && this._highlighted.indexOf(item) !== -1;
        };
    }

    return {
        newInstance: (arrowsContainerSelector, imagesContainerSelector, idFieldName) => new RelationsService(arrowsContainerSelector, imagesContainerSelector, idFieldName)
    };
}]);