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
.constant('CanvasSettings', {
    CANVAS_MARGIN : 0,
    CANVAS_PADDING_TOP : 85,
    CANVAS_MIN_HEIGHT : 600,
    UNIT_WIDTH : 100,
    UNIT_HEIGHT : 30,
    SPACE_BETWEEN_LAYERS : 5,
    TRACK_PADDING : 40,
    SPARE_OBJECT_COUNT : 4,
    MENU_PANEL_MIN_WIDTH : 300,
    FILTERS_MODAL_MIN_WIDTH : 600,
    
    MAX_DARKNESS : 65,
    DEFAULT_SATURATION : 70,
    MAX_LIGHTNESS : 85,
    
    LAYER_BASE_HEIGHT : 35,
    FILTERS_SMALL_LINE_HEIGHT : 14,
    
    OBJECT_TEXT_OPTIONS : '14px Arial',
    OBJECT_TEXT_COLOR : '#333333',
    OBJECT_TEXT_COORD_X : 15,
    OBJECT_TEXT_COORD_Y : 8,
    OBJECT_RECTANGLE_NAME: 'objRectangle',

    TOOLTIP_WIDTH : 200,
    TOOLTIP_HEIGHT : 45,
    TOOLTIP_SPACE : 15,
    TOOLTIP_TEXT_OPTIONS : '14px Arial',
    TOOLTIP_TEXT_COLOR : '#333333',
    TOOLTIP_TEXT_COORD_X : 10,
    TOOLTIP_TEXT_COORD_Y : 8,
    TOOLTIP_RECTANGLE_COLOR : '#FFFFFF',
    TOOLTIP_RECTANGLE_BORDER_COLOR : '#333333',

    DEBUG_OVERLOAD_COLOR: '#880000',
    DEBUG_OVERLOAD_X: 2,
    DEBUG_OVERLOAD_Y: 3,
    DEBUG_OVERLOAD_WIDTH: 4,
    DEBUG_OVERLOAD_HEIGHT: 4,

    INDICATOR_BLOCK_X: 0,    
    INDICATOR_BLOCK_Y: 1,    
    INDICATOR_BLOCK_WIDTH: 8,
    INDICATOR_BLOCK_COLOR_STROKE: '#888888',
    INDICATOR_BLOCK_COLOR_FILL: '#ffffff',

    BG_VERTICAL_STRIPE_COLOR_ODD: '#f8f8f8',
    BG_VERTICAL_STRIPE_COLOR_EVEN: '#ffffff',

    RULER_NICK_COLOR_STROKE : '#666666',
    RULER_NICK_TEXT_OPTIONS : '12px Arial',
    RULER_NICK_TEXT_PADDING_LEFT : 3,

    GRADIENT_LEFT_MULTIPLIER : 0.1,
    GRADIENT_RIGHT_MULTIPLIER : 0.9,

    SVG_TREE_LVL_WIDTH: 20,
    SVG_TREE_RIGHT_PADDING: 20,

    ATTRIBUTE_HEIGHT: {
        'BOOLEAN' : 60,
        'INTEGER' : 100,
        'STRING' : 100,
        'FLOAT' : 150,
        'ENUM' : 150
    },
    ATTRIBUTE_VALUES: {
        'BOOLEAN' : false,
        'INTEGER' : 0,
        'STRING' : '',
        'FLOAT' : [0, 0],
        'ENUM' : undefined
    },
});