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