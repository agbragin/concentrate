class Column {

    constructor (id) {

        this._cells = [];
        this._id = id;
    }

    get cells () { return this._cells }
    get id    () { return this._id    }

    addCell (cell) {
        this._cells.push(cell);
    }
}

angular.module('ghop-ui').value('Column', Column);