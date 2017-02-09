angular.module('ghop-ui')
.factory('Tooltip', ['CanvasSettings', function(CanvasSettings) {
    let tooltip = {};

    let show = (object, x, y, mainContainer) => {

        tooltip = new createjs.Container();
        
        let tooltipY = 0;
        if (CanvasSettings.TOOLTIP_HEIGHT + CanvasSettings.TOOLTIP_SPACE > y) {
            tooltipY = y + CanvasSettings.TOOLTIP_HEIGHT;
        } else {
            tooltipY = y - CanvasSettings.TOOLTIP_HEIGHT - CanvasSettings.TOOLTIP_SPACE;
        }

        tooltip.x = x - CanvasSettings.TOOLTIP_WIDTH/2;
        tooltip.y = tooltipY;
        
        let tooltipRectangle = new createjs.Shape();
        tooltipRectangle.graphics
            .beginFill(CanvasSettings.TOOLTIP_RECTANGLE_COLOR)
            .beginStroke(CanvasSettings.TOOLTIP_RECTANGLE_BORDER_COLOR)
            .drawRect(
                0, 
                0, 
                CanvasSettings.TOOLTIP_WIDTH,
                CanvasSettings.TOOLTIP_HEIGHT
            );
        tooltip.addChild(tooltipRectangle);

        let text = new createjs.Text(
            `label: ${object.name}\nlength: ${object.properties.endCoord.coord - object.properties.startCoord.coord}`,
            CanvasSettings.TOOLTIP_TEXT_OPTIONS, 
            CanvasSettings.TOOLTIP_TEXT_COLOR
        );
        text.x = CanvasSettings.TOOLTIP_TEXT_COORD_X;
        text.y = CanvasSettings.TOOLTIP_TEXT_COORD_Y;
        tooltip.addChild(text);

        mainContainer.addChild(tooltip);
    };

    let hide = () => {

        if (tooltip) {
            tooltip.removeAllChildren();
        }
    };

    return {
        show: show,
        hide: hide,
    };
}]);