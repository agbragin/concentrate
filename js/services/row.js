class Row {

    constructor (id, cells) {

        this._cells = cells;
        this._id = id;
    }

    set cells   (cells) { this._cells = cells   }
    get cells   ()      { return this._cells    }
    get id      ()      { return this._id       }
    set height  (height){ this._height = height }
    get height  ()      { return this._height   }
}

angular.module('ghop-ui').value('Row', Row);