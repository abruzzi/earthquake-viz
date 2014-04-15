$(function() {
    var map = new OpenLayers.Map("map");
    var osm = new OpenLayers.Layer.OSM();
    map.addLayer(osm);

    var earthquake = new OpenLayers.Layer.Vector("Earthquake", {
        strategies: [
            new OpenLayers.Strategy.Fixed()
        ],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "/all_day.geojson",
            format: new OpenLayers.Format.GeoJSON({ignoreExtraDims: true})
        })
    });
    
    var style = new OpenLayers.Style();

    var ruleLow = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Function({
            evaluate: function(properties) {
                return properties.mag < 3.0;
            }
        }),
        symbolizer: {pointRadius: 3, fillColor: "green",
            fillOpacity: 0.5, strokeColor: "black"}
    });

    var ruleHigh = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Function({
            evaluate: function(properties) {
                return properties.mag >= 3.0;
            }
        }),
        symbolizer: {pointRadius: 5, fillColor: "red",
            fillOpacity: 0.7, strokeColor: "black"}
    });

    style.addRules([ruleLow, ruleHigh]);

    earthquake.styleMap = new OpenLayers.StyleMap(style);

    var selectControl = new OpenLayers.Control.SelectFeature(earthquake, {
        onSelect: onFeatureSelect,
        onUnselect: onFeatureUnselect 
    });

    map.addControl(selectControl);
    selectControl.activate();

    function onFeatureSelect(feature) {
        var html = "<span>"+feature.attributes.title+"</span>";

        var popup = new OpenLayers.Popup.FramedCloud("popup",
                feature.geometry.getBounds().getCenterLonLat(),
                null,
                html,
                null,
                true
                );

        popup.panMapIfOutOfView = true;
        popup.autoSize = true;

        feature.popup = popup;

        map.addPopup(popup);
    }

    function onFeatureUnselect(feature) {
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }

    map.addLayer(earthquake);

    map.zoomToMaxExtent();
});
