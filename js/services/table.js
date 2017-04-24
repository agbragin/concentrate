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
.factory('TableFactory', 
    ['$log', 'CanvasValues', 'CanvasSettings', 'Cell', 'Row', 'Column', 
    ($log, CanvasValues, CanvasSettings, Cell, Row, Column) => {

    class Table {

        constructor (data, layers) {

            this._cells = [];
            this._rows = [];
            this._columns = [];
            this._densityByCell = [];

            this._generateRowsAndColumns(layers.length);
            this._calcDensity(data, layers);
            this._calcRowHeights();
        }

        get rows () { return this._rows }

        /**
         * Calculate the coordinates of the beginning and end of each column
         */
        _calcCellRanges (data, layers) {

            let ranges = new Array(CanvasValues.maxUnitCountPerTrack);
            ranges = ranges.fill().map(val => (val = [undefined, undefined]));
            
            data.forEach(_stripe => {
                
                let layerName = _stripe.track;
                if (_stripe.startCoord < CanvasValues.maxUnitCountPerTrack && _stripe.endCoord > 0) {
                    let end = Math.min(_stripe.endCoord, CanvasValues.maxUnitCountPerTrack) - 1;
                    let start = Math.max(0, _stripe.startCoord);

                    if (_stripe.startCoord >= 0) {
                        if (ranges[start][0] === undefined) {
                            ranges[start][0] = {
                                genome: _stripe.properties.startCoord.contig.referenceGenome.id,
                                contig: _stripe.properties.startCoord.contig.id,
                                coord: _stripe.properties.startCoord.coord,
                            }
                        }
                    }

                    if (ranges[start-1] !== undefined && ranges[start-1][1] === undefined) {
                               
                        ranges[start-1][1] = {
                            genome: _stripe.properties.startCoord.contig.referenceGenome.id,
                            contig: _stripe.properties.startCoord.contig.id,
                            coord: _stripe.properties.startCoord.coord,
                        }
                    }
                    
                    if (ranges[end][1] === undefined) {
                        ranges[end][1] = {
                            genome: _stripe.properties.endCoord.contig.referenceGenome.id,
                            contig: _stripe.properties.endCoord.contig.id,
                            coord: _stripe.properties.endCoord.coord,
                        };
                    } else {
                        ranges[end][1] = {
                            genome: _stripe.properties.endCoord.contig.referenceGenome.id,
                            contig: _stripe.properties.endCoord.contig.id,
                            coord: Math.min(_stripe.properties.endCoord.coord, ranges[end][1].coord),
                        };
                    }
                    
                    if (ranges[end+1] !== undefined) {

                        if (ranges[end+1][0] === undefined) {
                            ranges[end+1][0] = {
                                genome: _stripe.properties.endCoord.contig.referenceGenome.id,
                                contig: _stripe.properties.endCoord.contig.id,
                                coord: _stripe.properties.endCoord.coord,
                            };
                        } else {
                            ranges[end+1][0] = {
                                genome: _stripe.properties.endCoord.contig.referenceGenome.id,
                                contig: _stripe.properties.endCoord.contig.id,
                                coord: Math.min(_stripe.properties.endCoord.coord, ranges[end+1][0].coord),
                            };
                        }
                    }
                   
                    for (let j = start; j <= end; j++) {
                        let cell = this.getCell(CanvasValues.getTrackIdByName(layerName, layers), j);
                        cell.stripes.push(_stripe);
                        cell.leftInf = _stripe.startCoord < 0;
                        cell.rightInf = _stripe.endCoord > end;
                    }
                } else {
                    if (_stripe.startCoord < CanvasValues.maxUnitCountPerTrack && _stripe.endCoord === 0) {
                        let end = 0;
                        let start = _stripe.startCoord;
                        ranges[start] = [undefined, undefined];
                        ranges[start][0] = {
                            genome: _stripe.properties.startCoord.contig.referenceGenome.id,
                            contig: _stripe.properties.startCoord.contig.id,
                            coord: _stripe.properties.startCoord.coord,
                        };
                        ranges[start][1] = {
                            genome: _stripe.properties.endCoord.contig.referenceGenome.id,
                            contig: _stripe.properties.endCoord.contig.id,
                            coord: _stripe.properties.endCoord.coord,
                        };
                        ranges[end][0] = {
                            genome: _stripe.properties.endCoord.contig.referenceGenome.id,
                            contig: _stripe.properties.endCoord.contig.id,
                            coord: _stripe.properties.endCoord.coord,
                        };
                    }
                }
                
            });
            return ranges;
        }

        _generateRowsAndColumns (rowsCount) {

             for (let r = 0, i = 0; r < rowsCount; r++) {

                if (this._rows[r] === undefined) {
                    let rowCells = [];

                    for (let c = 0; c < CanvasValues.maxUnitCountPerTrack; c++) {
                        let cell = new Cell(i++, c, r);

                        this._cells.push(cell);
                        rowCells.push(cell);
                        
                        if (this._columns[c] === undefined) {
                            this._columns[c] = new Column(c);
                        }

                        this._columns[c].addCell(cell);
                    }

                    this._rows.push(new Row(r, rowCells));
                }
            }
        } 

        _calcRowHeights () {

            this._rows.forEach(row => {

                let openedSublayers = 1;

                row.cells.forEach(cell => {

                    // sort cell stripes by length
                    cell.stripes.sort((a,b) => (b.endCoord - b.startCoord - a.endCoord + a.startCoord));

                    cell.stripes.forEach((obj, index) => {
                        if (obj.sublayer === undefined) {
                            obj.sublayer = index;
                        } else {
                            obj.sublayer = Math.max(index, obj.sublayer);
                        }
                        
                        openedSublayers = Math.max(obj.sublayer + 1, openedSublayers);
                    });                    
                });

                row.height = openedSublayers;
            });
        }

        getCell (row, col) {

            let result = undefined;
            this._cells.forEach(_cell => {
                if (_cell.row === row && _cell.col === col) {
                    result = _cell;
                    return;
                }
            });

            if (result === undefined) {
                $log.warn(`could not find a cell with row ${row} and column ${col}`);
            }

            return result;
        }

        getCellByCoords (xCoord, yCoord, shift) {

            let col = Math.floor((xCoord - CanvasSettings.TRACK_PADDING - shift)/CanvasSettings.UNIT_WIDTH);
            
            if (col < 0) {
                col = 0;
            }
            if (col >= CanvasValues.maxUnitCountPerTrack) {
                col = CanvasValues.maxUnitCountPerTrack - 1;
            }
            let row = 0;
            if (yCoord !== 0) {
                row = Math.floor((yCoord - CanvasSettings.CANVAS_PADDING_TOP) / (CanvasSettings.UNIT_HEIGHT + CanvasSettings.SPACE_BETWEEN_LAYERS));
            }
            let openedRowsHeight = 0;
            for (let i = 0; i < row; i++) {
                
                let _row = this.fetchRow(i - openedRowsHeight);
                
                openedRowsHeight += _row.height - 1;
                i += _row.height - 1;
            }
            
            if (row > openedRowsHeight) {
                row -= openedRowsHeight;
            } else {
                row = 0;
            }

            return this.getCell(row, col);
        }

        getDensityByCell (cellNum) {
            
            if (this._densityByCell[cellNum] === undefined) {

                $log.warn(`there is no cell with num ${cellNum}`);

                if (cellNum > 0) {
                    while (cellNum > 0) {
                        return this.getDensityByCell(--cellNum);
                    }
                } else {
                    return this._densityByCell[0];
                }
            }

            return this._densityByCell[cellNum];
        }

        /**
         * Calculate the coordinates of the beginning and end of each column, 
         * as well as the length (`density`) of each column in absolute coordinates
         */
        _calcDensity (data, layers) {

            let ranges = this._calcCellRanges(data, layers);


            for (let i = 0; i < CanvasValues.maxUnitCountPerTrack; i++) {
                
                if (ranges[i][0] !== undefined && ranges[i][1] !== undefined) {
                    this._densityByCell.push({
                        start : ranges[i][0],
                        end : ranges[i][1],
                        size : Math.max(0, ranges[i][1].coord - ranges[i][0].coord),
                    }); 
                } else {
                    this._densityByCell.push({
                        start : {
                            coord: 0,
                            contig: 'chr1'
                        },
                        end : {
                            coord: 0,
                            contig: 'chr1'
                        },
                        size : Math.max(0, 0),
                    });
                } 
            }
        }

        _fetchCol (colId) {

            let selectedCells = [];
            this._rows.forEach((row, index) => {
                selectedCells.push(this._cells[index * CanvasValues.maxUnitCountPerTrack + colId]);
            });
            return this._columns[colId];
        };

        fetchRow (rowId) {
            return this._rows[rowId];
        };

        getRightmostCell (rowId) {
            let row = this.fetchRow(rowId);
            
            return row.cells[row.cells.length - 1];
        };

        getLeftmostCell (rowId) {

            let row = this.fetchRow(rowId);
            return row.cells[0];
        };
    }

    return {
        instance: (data, layers) => new Table(data, layers)
    };
}]);