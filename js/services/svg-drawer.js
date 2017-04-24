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
.factory('SVGDrawer', 
    ['$log', '$timeout', 'CanvasSettings', ($log, $timeout, CanvasSettings) => {

    class SVGDrawer {

        constructor(arrowsContainerSelector, imagesContainerSelector) {

            this._treeLVLWidth = CanvasSettings.SVG_TREE_LVL_WIDTH;
            this._connectors = [];

            // 0-seconds timeout for DOM reloading when popup are openning
            $timeout(() => {
                this._arrowsContainer = document.querySelector(arrowsContainerSelector);
                this._imagesContainer = document.querySelector(imagesContainerSelector);
            });
        }
        
        draw(relations, collection, idField) {

            this.clear();

            relations.filter(r => r.type !== 'SINGLE').forEach(relation => {
                let divsA = [],
                    divsB = [],
                    heightA = 0,
                    heightB = 0,
                    offsetTopA = 0,
                    firstRelation = relations.find(el => el.id === relation.first),
                    secondRelation = relations.find(el => el.id === relation.second),
                    lvlA = firstRelation.lvl,
                    lvlB = secondRelation.lvl,
                    offsetTopB = 0;

                let topItemIndexA = collection.length;
                firstRelation.items.forEach((item, index) => {

                    heightA += item.style.height;
                    topItemIndexA = Math.min(
                        collection.findIndex(el => (el[idField] === item[idField])), 
                        topItemIndexA
                    );
                });

                for (let i = 0; i < topItemIndexA; i++) {
                    offsetTopA += collection[i].style.height;
                }

                let topItemIndexB = collection.length;
                secondRelation.items.forEach((item, index) => {

                    heightB += item.style.height;
                    topItemIndexB = Math.min(
                        collection.findIndex(el => (el[idField] === item[idField])), 
                        topItemIndexB
                    );
                });

                for (let i = 0; i < topItemIndexB; i++) {
                    offsetTopB += collection[i].style.height;
                }
                
                this._drawConnector(relation.id, heightA, heightB, offsetTopA, offsetTopB, lvlA, lvlB, 'images/logic_' + relation.type + '.png');
            });
        }
        
        _drawConnector (id, heightA, heightB, offsetTopA, offsetTopB, lvlA, lvlB, filename) {

            let path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

            let maxLvl = Math.max(lvlA, lvlB) + 1;

            let posnARight = {
                x: 0,
                y: offsetTopA + heightA / 2
            };
            let posnBRight = {
                x: 0,
                y: offsetTopB + heightB / 2
            };

            let points = '';
            points += (posnARight.x + this._treeLVLWidth*lvlA)   + ',' + posnARight.y;
            points += ' ';
            points += (posnARight.x + this._treeLVLWidth*maxLvl) + ',' + posnARight.y;
            points += ' ';
            points += (posnARight.x + this._treeLVLWidth*maxLvl) + ',' + posnBRight.y;
            points += ' ';
            points += (posnBRight.x + this._treeLVLWidth*lvlB)   + ',' + posnBRight.y;

            path.setAttribute("points", points);
            this._arrowsContainer.appendChild(path);
            this._addSign(filename, this._treeLVLWidth * maxLvl, posnARight.y, posnBRight.y);
        };

        _addSign (filename, x, y1, y2) {

            let sign = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            sign.setAttributeNS('http://www.w3.org/1999/xlink', 'href', filename);
            sign.setAttributeNS(null, 'x', x - 8);
            sign.setAttributeNS(null, 'y', y1 + (y2 - y1)/2 - 8);
            sign.setAttributeNS(null, 'height', 16);
            sign.setAttributeNS(null, 'width', 16);

            this._imagesContainer.appendChild(sign);
        }

        clear () {
            if (this._arrowsContainer !== undefined) {
                while(this._arrowsContainer.firstChild) this._arrowsContainer.removeChild(this._arrowsContainer.firstChild);
            }
            if (this._arrowsContainer !== undefined) {
                while(this._imagesContainer.firstChild) this._imagesContainer.removeChild(this._imagesContainer.firstChild);
            }
        }

        clearAll () {
            this._connectors = [];
            this.clear();
        }
    }

    return {
        newDrawer: (arrowsContainerSelector, imagesContainerSelector) => new SVGDrawer(arrowsContainerSelector, imagesContainerSelector)
    };
}]);