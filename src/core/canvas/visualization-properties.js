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
 *******************************************************************************/


angular.module('concentrate')
.constant('VisualizationProperties', {

    /** Units */
    UNIT_WIDTH: 100,
    UNIT_HEIGHT: 30,

    /** Background */
    BG_COLUMN_ODD: '#f8f8f8',
    BG_COLUMN_EVEN: '#ffffff',

    /** Borders */
    COORDINATE_DASH_COLOR: '#afafaf',
    COORDINATE_DASH_HEIGHT: 15,
    COORDINATE_DASH_LABEL_STYLE: '12px Calibri',
    COORDINATE_DASH_LABEL_MARGIN_X: 6,
    COORDINATE_DASH_LABEL_MARGIN_TOP: 2,

    /** Grid */
    GRID_MARGIN_TOP: 40,
    GRID_TRACK_BACKGROUND_ALPHA: 0.2,
    GRID_TRACK_BACKGROUND_PADDING_Y: 4,
    GRID_TRACK_MARGIN_BOTTOM: 5,
    GRID_TRACK_LEVEL_MARGIN_BOTTOM: 2,

    /** Stripes */
    STRIPE_BORDER_COLOR: '#9f9f9f',
    STRIPE_DEFAULT_ALPHA: 0.9,
    STRIPE_HOVER_ALPHA: 1,
    STRIPE_LABEL_MARGIN_X: 10,
    STRIPE_LABEL_MARGIN_TOP: 8,
    STRIPE_LABEL_STYLE: '14px Calibri',
    STRIPE_LABEL_COLOR: '#333333',
    STRIPE_COLORS: [
        '#F48679', // Brick Red
        '#94D1BA', // Lagoon Green
        '#FAE050', // Yellow
        '#F06AC1', // Pink
        '#BD91FF', // Violet
        '#B89656', // Wood Brown
        '#FB1E50', // Rose Red
        '#B3DA7E', // Grass Green
        '#EFBE75', // Sand Yellow
        '#FE9B38', // Orange
        '#B1B773', // Swamp Mud
        '#65F0AE', // Gum Green
        '#BCC2B6', // Grey
        '#E3E069'  // Ill Yellow
    ],

    /** Chromosome stripe color */
    STRIPE_CHROMOSOME_COLOR: '#94c9f3',

    /** Nucletide stripe colors */
    STRIPE_NUCLEOTIDE_COLOR_ADENINE: '#b8dee7',
    STRIPE_NUCLEOTIDE_COLOR_ANY: '#ada4c8',
    STRIPE_NUCLEOTIDE_COLOR_CYTOSINE: '#fab9af',
    STRIPE_NUCLEOTIDE_COLOR_GUANINE: '#9fd374',
    STRIPE_NUCLEOTIDE_COLOR_THYMINE: '#fee77a',

    /** Density schema */
    STRIPE_MAX_DENSITY: 1,
    STRIPE_MIN_DENSITY: 0.5,
    STRIPE_GRADIENT_WIDTH: 10
});