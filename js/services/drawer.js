angular.module('ghop-ui')
.factory('DrawerFactory', 
    ['$q', '$log', 'CanvasSettings', 'CanvasValues', 'TableFactory', 'Tooltip', 
    ($q, $log, CanvasSettings, CanvasValues, TableFactory, Tooltip) => {
    
    class Drawer {
        constructor (stage, canvas, layers, striper, modalHandler, layerChangeHandler) {

            this._striper = striper;
            this._stage = stage;
            this._canvas = canvas;
            this._layers = layers;
            this._switcher = 0;
            this._modalHandler = modalHandler;
            this._layerChangeHandler = layerChangeHandler;
            this._clickBlock = false;

            $log.debug(`New Drawer instantiated for ${layers.length} layers`);
        }

         get sublayersCount () { return this._sublayersCount }
         get mainContainer () { return this._mainContainer }
         get switcher () { return this._switcher }

        _drawLayer (layer) {

            let layerShapes = [];
            
            for (let i = 0; i < layer.sublayersCount; i++) {
                let layerShape = new createjs.Container();
                layerShape.x = 0;
                layerShape.y = CanvasSettings.CANVAS_PADDING_TOP + this._sublayersCount * (CanvasSettings.UNIT_HEIGHT + CanvasSettings.SPACE_BETWEEN_LAYERS); 
                this._mainContainer.addChild(layerShape);
                layerShapes.push(layerShape);
                this._sublayersCount++;
            }
            
            return layerShapes;
        };

        trivialHop(striper, shift) {

            if (shift < 0) {
                striper.leftTrivialHop();
            } else {
                striper.rightTrivialHop();
            }

            striper.stripes.then(
                stripes => {

                    this.draw(stripes);
                    if (Math.abs(shift) > CanvasSettings.UNIT_WIDTH) {
                        if (shift < 0) {
                            shift += CanvasSettings.UNIT_WIDTH;
                        } else {
                            shift -= CanvasSettings.UNIT_WIDTH;
                        }
                        
                        this.trivialHop(striper, shift);
                    }
                },
                error => $log.error(error)
            );
        }

        draw (data) {

            CanvasValues.maxStripeLength = 1;
            
            data.forEach(_stripe => {
                CanvasValues.maxStripeLength = Math.max(CanvasValues.maxStripeLength, _stripe.properties.endCoord.coord - _stripe.properties.startCoord.coord);
            });

            this._table = TableFactory.instance(data, this._layers);
            this._table.rows.forEach((row, index) => {
                this._layers[index].sublayersCount = row.height;
            });
            
            // clear canvas data
            this._stage.removeAllChildren();
            this._stage.update();

            // the main draggable container
            this._mainContainer = new createjs.Container();
            this._mainContainer.x = 0;
            this._mainContainer.y = 0;

            this._switcher = this._switcher ? 0 : 1;
            this._drawBG();                
            this._drawRuler();
            
            $log.debug('draw data');
            
            /**
             * 'layer' is not a necessary element, but it is a useful structural pattern
             * We can place our stripes like a child of layer and don't care about its vertical position
             */
            this._layers.forEach((layer, index) => {
                
                if (layer !== undefined) {
                    layer.shapes = this._drawLayer(layer);
                }
            });

            /**
             * It limits the number of draw elements for debug
             */
            data.forEach(_stripe => {

                if (_stripe.startCoord < CanvasValues.maxUnitCountPerLayer) {
                    
                    let stripeContainer = this._drawStripe(_stripe, this._layers[_stripe.track]);

                    if (stripeContainer === false) {
                        return;
                    }

                    stripeContainer.on('click', event => {

                        if (this._clickBlock && this._mainContainer.x !== 0) {
                            return;
                        }

                        let cell = this._table.getCellByCoords(event.stageX, event.stageY, this._mainContainer.x);
                        let row = this._table.fetchRow(cell.row);
                        let layerId = CanvasValues.getLayerIdByName(_stripe.track, this._layers);
                        this._modalHandler(_stripe, this._layers[layerId]);
                    });

                        
                    let sublayerNum =  _stripe.sublayer !== undefined ? _stripe.sublayer : 0;
                
                    let layerId = CanvasValues.getLayerIdByName(_stripe.track, this._layers);
                    this._layers[layerId].shapes[sublayerNum].addChild(stripeContainer);
                    
            
                    _stripe.shape = stripeContainer;
                }
            });
            let shift = 0;
            let startPosition = undefined;
            let lastRequestNum = 0;
            let readyRequestNum = 0;

            this._mainContainer.on("pressmove", evt => {

                /** 
                 * Catch start mainContainer position on first pressmove event in row
                 * and calculate left and right infinity stripes
                 */
                if (startPosition === undefined) {
                    startPosition = evt.stageX;
                    shift = 0;
                    this._clickBlock = true;
                    
                    this._table.rows.forEach((row, index) => {
                        this._layers[index].sublayersCount = row.height;
                    });
                    
                } else {
                    shift = evt.stageX - startPosition;
                }

                if (Math.abs(shift) >= CanvasSettings.UNIT_WIDTH) {
                    
                    this.trivialHop(this._striper, shift);
                    startPosition = undefined;
                }
            });

            this._mainContainer.on('pressup', evt => {
                this._clickBlock = false;
            });
            
            this._stage.addChild(this._mainContainer);

            this._stage.update();
            createjs.Ticker.addEventListener('tick', this._stage);
                
            this._layerChangeHandler();
        };

        _drawFill (stripeShape, stripe, coordStart, stripeWidth) {
            if (stripe.startCoord < 0 && stripe.endCoord === 0) {
                return this._drawSolidFill(stripeShape, stripe);
            }

            if (stripe.endCoord - stripe.startCoord > 1) {
                return this._drawGradientFill(stripeShape, stripe, coordStart, stripeWidth);
            } else {
                return this._drawSolidFill(stripeShape, stripe);
            }
        }

        _drawSolidFill (stripeShape, stripe) {

            let stripeSize = stripe.properties.endCoord.coord - stripe.properties.startCoord.coord;
            let layerId = CanvasValues.getLayerIdByName(stripe.track, this._layers);

            /**
             * CanvasValues.maxStripeLength - is a max size (in genome coordinates) of element on current layer
             * The longer the stripe in genome coordinates, the darker it's color
             */
            let maxStripeLengthLog = Math.max(1, Math.log(CanvasValues.maxStripeLength)) / Math.log(10);
            let currentStripeLengthLog = Math.log(stripeSize) / Math.log(10);

            
            let darkness = Math.floor(currentStripeLengthLog * CanvasSettings.MAX_DARKNESS / maxStripeLengthLog);

            /** 
             * Calc lightness in range [(85-65):85] = [20:85] - extreme values were chosen experimentally, non-white and non-black
             */
            let mainColor = createjs.Graphics.getHSL(CanvasValues.calcHueValue(layerId, this._layers.length), CanvasSettings.DEFAULT_SATURATION, CanvasSettings.MAX_LIGHTNESS - darkness);

            return stripeShape.graphics.beginFill(mainColor);
        }

        _drawGradientFill (stripeShape, stripe, coordStart, stripeWidth) {

            let layerId = CanvasValues.getLayerIdByName(stripe.track, this._layers);

            let colors = [];
            let positions = [];
            let stripeEnd = Math.min(stripe.endCoord, CanvasValues.maxUnitCountPerLayer);
            let stripeStart = Math.max(stripe.startCoord, 0);
            let stripeSize = stripeEnd - stripeStart;

            /**
             * CanvasValues.maxStripeLength - is a max size (in genome coordinates) of element on current layer
             * The longer the stripe in genome coordinates, the darker it's color
             */
            let maxStripeLengthLog = Math.max(1, Math.log(CanvasValues.maxStripeLength)) / Math.log(10);

            for (let i = stripeStart; i < stripeEnd; i++) {
                let density = this._table.getDensityByCell(i);
                let index = i - stripeStart;
                let currentStripeLengthLog = 0;

                if (density.size !== 0) {
                    currentStripeLengthLog = Math.log(density.size) / Math.log(10);
                }
                
                let localDarkness = Math.floor(currentStripeLengthLog * CanvasSettings.MAX_DARKNESS / maxStripeLengthLog);
                let localColor = createjs.Graphics.getHSL(CanvasValues.calcHueValue(layerId, this._layers.length), CanvasSettings.DEFAULT_SATURATION, CanvasSettings.MAX_LIGHTNESS - localDarkness);
                
                colors.push(localColor, localColor);
                positions.push((index + CanvasSettings.GRADIENT_LEFT_MULTIPLIER)/stripeSize);
                positions.push((index + CanvasSettings.GRADIENT_RIGHT_MULTIPLIER)/stripeSize);
            }

            return stripeShape.graphics.beginLinearGradientFill(colors, positions, coordStart, 0, stripeWidth, 0);
        };

        _drawOverloadIndicator (stripe) {

            let layerId = CanvasValues.getLayerIdByName(stripe.track, this._layers);
            
            for (let i = stripe.startCoord; i < Math.min(stripe.endCoord, CanvasValues.maxUnitCountPerLayer); i++) {
                let cell = this._table.getCell(layerId, i);
                
                if (cell !== undefined && cell.stripes.length > 1) {
                    let indicator = new createjs.Shape();

                    indicator.graphics.beginFill(CanvasSettings.DEBUG_OVERLOAD_COLOR).drawRect(
                        CanvasSettings.DEBUG_OVERLOAD_X,
                        CanvasSettings.DEBUG_OVERLOAD_Y,
                        CanvasSettings.DEBUG_OVERLOAD_WIDTH,
                        CanvasSettings.DEBUG_OVERLOAD_HEIGHT
                    );

                    return indicator;
                }
            }

            return false;
        };

        _drawStripe (stripe, layer) {

            if (stripe.startCoord < 0 && stripe.endCoord < 0) {
                $log.info(stripe);
                return false;
            }

            let coordStart = 0;
            if (stripe.startCoord < 0) {
                coordStart = 0;
            } else {
                coordStart = CanvasSettings.LAYER_PADDING + stripe.startCoord * CanvasSettings.UNIT_WIDTH;
            }
           
            let stripeContainer = new createjs.Container();        
            stripeContainer.x = coordStart;
            stripeContainer.y = 0;

            let stripeShape = new createjs.Shape();

            let stripeWidth = 0, stripeSize = 0, gradientStart = 0, gradientWidth = 0;
            let stripeHeight = CanvasSettings.UNIT_HEIGHT;
            let stripeEnd = Math.min(stripe.endCoord, CanvasValues.maxUnitCountPerLayer);
             
            if (stripe.startCoord < 0) {
                stripeSize = Math.max(stripeEnd, 0);
            } else {
                stripeSize = stripeEnd - stripe.startCoord;
            }

            if (stripe.endCoord > CanvasValues.maxUnitCountPerLayer) {
                stripeWidth = this._canvas.width - stripeContainer.x;
                gradientWidth = stripeSize * CanvasSettings.UNIT_WIDTH;

                if (stripe.startCoord < 0) {
                    gradientStart = CanvasSettings.LAYER_PADDING;
                    gradientWidth += CanvasSettings.LAYER_PADDING;
                }
            } else {
                
                stripeWidth = CanvasSettings.UNIT_WIDTH * stripeSize;

                if (stripe.startCoord < 0) {
                    stripeWidth += CanvasSettings.LAYER_PADDING;

                    if (stripe.endCoord === 0) {
                         gradientStart = 0;
                    } else {
                         gradientStart = CanvasSettings.LAYER_PADDING;
                    }
                }
                
                gradientWidth = stripeWidth;
            }
            
            this._drawFill(stripeShape, stripe, gradientStart, gradientWidth).drawRect(
                0, 
                0, 
                stripeWidth,
                stripeHeight
            );

            let indicators = [];

            if (stripe.startCoord >= 0) {
                stripeShape.graphics
                    .beginStroke(CanvasSettings.INDICATOR_BLOCK_COLOR_STROKE)
                    .beginFill(CanvasSettings.INDICATOR_BLOCK_COLOR_FILL)
                    .drawRect(
                        CanvasSettings.INDICATOR_BLOCK_X, 
                        CanvasSettings.INDICATOR_BLOCK_Y, 
                        CanvasSettings.INDICATOR_BLOCK_WIDTH,
                        stripeHeight - 2
                    );

                let overloadIndicator = this._drawOverloadIndicator(stripe, stripeContainer);
                if (overloadIndicator !== false) {
                    indicators.push(overloadIndicator);
                }
            }
            stripeShape.name = CanvasSettings.OBJECT_RECTANGLE_NAME;

            stripeShape.on('mouseover', event => {
                if (!this._clickBlock || this._mainContainer.x === 0) {
                    event.target.alpha = 0.5;
                    Tooltip.show(stripe, event.stageX, event.stageY, this._mainContainer);
                }
            });

            stripeShape.on('mouseout', event => {
                if (!this._clickBlock || this._mainContainer.x === 0) {
                    event.target.alpha = 1;
                    Tooltip.hide();
                }
            });

            stripeContainer.addChild(stripeShape);
            indicators.forEach(indicatorShape => {
                stripeContainer.addChild(indicatorShape);
            });

            if (stripeSize > 0 || stripe.endCoord >= 0) {
                let text = new createjs.Text(stripe.name, CanvasSettings.OBJECT_TEXT_OPTIONS, CanvasSettings.OBJECT_TEXT_COLOR);
                text.x = CanvasSettings.OBJECT_TEXT_COORD_X;
                text.y = CanvasSettings.OBJECT_TEXT_COORD_Y;
                text.mouseEnabled = false;
                
                stripeContainer.addChild(text);
            }
            
            return stripeContainer;
        };

        _drawBG () {

            this._sublayersCount = 0;
            let bg = new createjs.Shape();

            for (let i = 0; i <= CanvasValues.maxUnitCountPerLayer; i++) {
                let color = i % 2 === 0 ? CanvasSettings.BG_VERTICAL_STRIPE_COLOR_ODD : CanvasSettings.BG_VERTICAL_STRIPE_COLOR_EVEN;
                
                bg.graphics.beginFill(color).drawRect(
                    i === 0 ? 0 : i * CanvasSettings.UNIT_WIDTH + CanvasSettings.LAYER_PADDING, 
                    0, 
                    i === 0 ? CanvasSettings.UNIT_WIDTH + CanvasSettings.LAYER_PADDING : CanvasSettings.UNIT_WIDTH,
                    this._canvas.height
                );
            }

            this._mainContainer.addChild(bg);
        }

        _drawRuler () {

            let positions = [];
            let colors = [];
            let firstCellDensity = this._table.getDensityByCell(0);
            let lastCellDensity = this._table.getDensityByCell(CanvasValues.maxUnitCountPerLayer - 2);
            let stripeSize = CanvasValues.maxUnitCountPerLayer;
            let maxStripeLengthLog = Math.max(1, Math.log(CanvasValues.maxStripeLength)) / Math.log(10);
            
            let prevDensity;
            for (let index = 0; index < CanvasValues.maxUnitCountPerLayer; index++) {
                let density = this._table.getDensityByCell(index);

                if (density !== undefined) {

                    let currentStripeLengthLog = 0;

                    if (density.size !== 0) {
                        currentStripeLengthLog = Math.log(density.size) / Math.log(10);
                    }

                    let localDarkness = Math.floor(currentStripeLengthLog * CanvasSettings.MAX_DARKNESS / maxStripeLengthLog);

                    let localColor = createjs.Graphics.getHSL(0, 0, CanvasSettings.MAX_LIGHTNESS - localDarkness);
                    
                    colors.push(localColor, localColor);
                    positions.push(index/stripeSize + 1/(10*stripeSize));
                    positions.push(index/stripeSize + 9/(10*stripeSize));
                    
                    let cellStartCoord = CanvasSettings.LAYER_PADDING + index * CanvasSettings.UNIT_WIDTH;
                    let line = new createjs.Shape();
                    line.graphics
                        .beginStroke(CanvasSettings.RULER_NICK_COLOR_STROKE)
                        .moveTo(cellStartCoord, CanvasSettings.UNIT_HEIGHT)
                        .lineTo(cellStartCoord, CanvasSettings.UNIT_HEIGHT*1.5);

                    let text;
                    if (prevDensity !== undefined && density.start.coord < prevDensity.end.coord) {
                        text = new createjs.Text(prevDensity.end.coord, CanvasSettings.RULER_NICK_TEXT_OPTIONS, CanvasSettings.OBJECT_TEXT_COLOR);
                    } else {
                        text = new createjs.Text(density.start.coord, CanvasSettings.RULER_NICK_TEXT_OPTIONS, CanvasSettings.OBJECT_TEXT_COLOR);
                    }
                    
                    text.x = cellStartCoord + CanvasSettings.RULER_NICK_TEXT_PADDING_LEFT;
                    text.y = CanvasSettings.UNIT_HEIGHT;
                    prevDensity = density;
                    
                    this._mainContainer.addChild(line);
                    this._mainContainer.addChild(text);
                }
                
            }

            let cellStartCoord = CanvasSettings.LAYER_PADDING + CanvasSettings.UNIT_WIDTH * CanvasValues.maxUnitCountPerLayer;
            let line = new createjs.Shape();
            let density = this._table.getDensityByCell(CanvasValues.maxUnitCountPerLayer - 1);
            
            if (density.end.coord !== 0) {
                line.graphics
                    .beginStroke(CanvasSettings.RULER_NICK_COLOR_STROKE)
                    .moveTo(cellStartCoord, CanvasSettings.UNIT_HEIGHT)
                    .lineTo(cellStartCoord, CanvasSettings.UNIT_HEIGHT*1.5);

                let text = new createjs.Text(density.end.coord, CanvasSettings.RULER_NICK_TEXT_OPTIONS, CanvasSettings.OBJECT_TEXT_COLOR);
                text.x = cellStartCoord + CanvasSettings.RULER_NICK_TEXT_PADDING_LEFT;
                text.y = CanvasSettings.UNIT_HEIGHT;
                
                this._mainContainer.addChild(line);
                this._mainContainer.addChild(text);
            }
            

            let ruler = new createjs.Shape();
            ruler.graphics
                .beginLinearGradientFill(colors, positions, CanvasSettings.LAYER_PADDING, 0, CanvasSettings.LAYER_PADDING + CanvasSettings.UNIT_WIDTH * CanvasValues.maxUnitCountPerLayer, 0)
                .drawRect(
                    -CanvasSettings.UNIT_WIDTH, 
                    CanvasSettings.UNIT_HEIGHT / 2, 
                    this._canvas.width + CanvasSettings.UNIT_WIDTH*2,
                    CanvasSettings.UNIT_HEIGHT / 2
                );

            
            this._mainContainer.addChild(ruler);
        }
    }

    return {
        instance: (stage, canvas, layers, striper, modalHandler, layerChangeHandler) => new Drawer(stage, canvas, layers, striper, modalHandler, layerChangeHandler)
    };
}]);