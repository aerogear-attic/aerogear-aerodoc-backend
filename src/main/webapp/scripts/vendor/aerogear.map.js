/*! AeroGear Geo Plugin
* https://github.com/aerogear/aerogear-geo-cordova
* JBoss, Home of Professional Open Source
* Copyright Red Hat, Inc., and individual contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var AeroGear = AeroGear || {};
(function () {
    'use strict';

    AeroGear.Map = function (opt) {
        var first, pulsate, resize, options, self;
        first = true;


        if (!(this instanceof AeroGear.Map)) {
            return new AeroGear.Map(opt);
        }

        options = opt || {};

        this.map = new OpenLayers.Map({
            div: options.element || "map",
            theme: options.theme || null,
            projection: options.projection || new OpenLayers.Projection("EPSG:4326"),
            numZoomLevels: options.numZoomLevels || 18,
            // mobile enabled map...
            controls: [
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                }),
                new OpenLayers.Control.Zoom()
            ],
            layers: [
                new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                    transitionEffect: 'resize'
                })
            ],
            units: 'km'
        });

        this.vector = new OpenLayers.Layer.Vector('vector');
        this.map.addLayer(this.vector);

        self = this;
        pulsate = function (feature) {
            var point = feature.geometry.getCentroid(),
                bounds = feature.geometry.getBounds(),
                radius = Math.abs((bounds.right - bounds.left) / 2),
                count = 0,
                grow = 'up';

            resize = function () {
                if (count > 16) {
                    clearInterval(window.resizeInterval);
                }
                var interval = radius * 0.03;
                var ratio = interval / radius;
                switch (count) {
                    case 4:
                    case 12:
                        grow = 'down';
                        break;
                    case 8:
                        grow = 'up';
                        break;
                }
                if (grow !== 'up') {
                    ratio = -Math.abs(ratio);
                }
                feature.geometry.resize(1 + ratio, point);
                self.vector.drawFeature(feature);
                count++;
            };
            window.resizeInterval = window.setInterval(resize, 50);
        };

        this.watchedPosition = function (position) {
            var point, circle, compassHeading;

            point = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude)
                .transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    self.map.getProjectionObject()
                );

            self.drawMarker(point);

            if (options.accuracy) {
                circle = new OpenLayers.Feature.Vector(
                    OpenLayers.Geometry.Polygon.createRegularPolygon(
                        point,
                        position.coords.accuracy / 2,
                        40,
                        0
                    ),
                    {},
                    {
                        fillColor: '#AFEEEE',
                        fillOpacity: 0.3,
                        strokeWidth: 2,
                        strokeColor: "#0EE"
                    }
                );

                self.vector.addFeatures(circle);

                if (first) {
                    pulsate(circle);
                    first = false;
                }
            }

            if (options.compass && navigator.compass) {
                compassHeading = 0;
                self.vector.styleMap = new OpenLayers.Style({
                    graphicName: 'triangle',
                    rotation: "${direction}"
                }, {
                    context: {
                        direction: function () {
                            return compassHeading;
                        }
                    }
                });

                navigator.compass.watchHeading(
                    function (heading) {
                        compassHeading = parseInt(heading.magneticHeading, 10);
                        self.vector.drawFeature(self.vector.features[0]);
                    },
                    function onError(compassError) {
                        throw 'Compass error: ' + compassError.code;
                    }
                );
            }

            if (options.radius) {
                self.drawGeoFence(options.origin, options.radius, options.sides);
            }

            self.map.zoomToExtent(self.vector.getDataExtent());
        };
    }

    AeroGear.Map.prototype.watchPosition = function () {
        this.watchId = navigator.geolocation.watchPosition(this.watchedPosition);
    }

    AeroGear.Map.prototype.clearWatch = function () {
        navigator.geolocation.clearWatch(this.watchId);
    }

    AeroGear.Map.prototype.drawMarker = function (lonLat) {
        var point = new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat);
        this.vector.addFeatures(
            new OpenLayers.Feature.Vector(
                point,
                {},
                {
                    strokeColor: '#4A777A',
                    strokeWidth: 1,
                    fillOpacity: 1,
                    pointRadius: 9,
                    fillColor: '#008B8B'
                }
            )
        );
    }

    AeroGear.Map.prototype.drawGeoFence = function (origin, radius, sides) {
        var circle, modifyControl, point, center, layer;

        center = origin || this.vector.features[0].geometry.getBounds().getCenterLonLat();
        point = new OpenLayers.Geometry.Point(center.lon, center.lat);
        circle = new OpenLayers.Feature.Vector(
            OpenLayers.Geometry.Polygon.createRegularPolygon(point, radius || 10, sides || 40, 0),
            {},
            {
                fillColor: '#F87431',
                fillOpacity: 0.2,
                strokeWidth: 2,
                strokeColor: '#C35817'
            }
        );

        var vertexStyle = {
            strokeColor: "#ff0000",
            fillColor: "#ffaa00",
            strokeOpacity: 1,
            strokeWidth: 2,
            pointRadius: 5
        }

        var styleMap = new OpenLayers.StyleMap({
            "default": OpenLayers.Feature.Vector.style['default'],
            "vertex": vertexStyle
        }, {extendDefault: false});

        layer = new OpenLayers.Layer.Vector('fence', {styleMap: styleMap});
        this.map.addLayer(layer);
        layer.addFeatures(circle);

        modifyControl = new OpenLayers.Control.ModifyFeature(layer, {vertexRenderIntent: "vertex"});
        modifyControl.mode = OpenLayers.Control.ModifyFeature.RESIZE;

        this.map.addControls([modifyControl]);
        modifyControl.activate();

        this.map.zoomToExtent(layer.getDataExtent());
    };

    AeroGear.Map.prototype.addFenceModificationListener = function(callback) {
        var layer = this.map.getLayersByName('fence')[0];
        layer.events.register('featuremodified', layer.features[0], function(event) {
            var center = event.feature.geometry.getCentroid();
            var point1 = event.feature.geometry.components[0].components[1];
            var radius = center.distanceTo(point1);
            callback(event.feature.geometry.getBounds().getCenterLonLat(), radius);
        });
    }
  
    AeroGear.Map.prototype.getProjectionObject = function() {
        return this.map.getProjectionObject();
    }
}());