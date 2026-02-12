
window.mapaSIT = null;


document.addEventListener('DOMContentLoaded', () => {
    window.mapaSIT = L.map('mapa-sit').setView([-26.20, -60.47], 7);

    L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{y}.png', {
        tms: true,
        maxZoom: 18,
        attribution: '&copy; IGN Argentina'
    }).addTo(window.mapaSIT);


    const areasProtegidas = L.tileLayer.wms("https://sit.chaco.gob.ar/geoserver/wms", {
        layers: 'BASE_AMBIENTE:areas_protegidas',
        format: 'image/png',
        transparent: true,
        attribution: "SIT Chaco"
    }).addTo(window.mapaSIT);

    const cuencas = L.tileLayer.wms("https://sit.chaco.gob.ar/geoserver/wms", {
        layers: 'BASE_AMBIENTE:cuencas_hidricas',
        format: 'image/png',
        transparent: true,
        attribution: "SIT Chaco"
    });

    const lineaAgronomica = L.tileLayer.wms("https://sit.chaco.gob.ar/geoserver/wms", {
        layers: 'BASE_AMBIENTE:linea_agronomica_areas_exclusion',
        format: 'image/png',
        transparent: true,
        attribution: "SIT Chaco"
    }).addTo(window.mapaSIT);

    const unidadesPaisaje = L.tileLayer.wms("https://sit.chaco.gob.ar/geoserver/wms", {
        layers: 'BASE_AMBIENTE:unidadesdepaisaje_inventariohumedales',
        format: 'image/png',
        transparent: true,
        attribution: "SIT Chaco"
    }).addTo(window.mapaSIT);

    
    const ejidosUrbanos = L.tileLayer.wms("https://sit.chaco.gob.ar/geoserver/wms", {
        layers: 'BASE_DES_TERR:ejidos_urbanos',
        format: 'image/png',
        transparent: true,
        attribution: "SIT Chaco"
    }).addTo(window.mapaSIT);


    const overlayMaps = {
        "Áreas Protegidas": areasProtegidas,
        "Cuencas Hídricas": cuencas,
        "Línea Agronómica": lineaAgronomica,
        "Unidades de paisaje de humedales": unidadesPaisaje,
        "Ejidos Urbanos": ejidosUrbanos
    };

    L.control.layers(null, overlayMaps, { collapsed: true }).addTo(window.mapaSIT);


    hacerClickeable(window.mapaSIT);


    setTimeout(() => { window.mapaSIT.invalidateSize(); }, 500);
});



function hacerClickeable(map) {
    map.on('click', function(e) {
        map.eachLayer(function(layer) {
            if (layer instanceof L.TileLayer.WMS && !layer.options.tms) {
                
                var url = getFeatureInfoUrl(map, layer, e.latlng, {
                    'info_format': 'application/json' 
                });

                fetch(url)
                    .then(response => response.json()) 
                    .then(data => {
                        if (data.features && data.features.length > 0) {
                            var props = data.features[0].properties; 
                            var content = '<div class="popup-simple">';
                            for (var key in props) {
                                if (key !== 'bbox' && key !== 'the_geom') { 
                                    content += `<div><strong>${key}:</strong> ${props[key] || 'sin datos'}</div>`;
                                }
                            }
                            content += '</div>';

                            L.popup()
                                .setLatLng(e.latlng)
                                .setContent(content)
                                .openOn(map);
                        }
                    })
                    .catch(err => console.log("Error o nada clickeado"));
            }
        });
    });
}

function getFeatureInfoUrl(map, layer, latlng, params) {
    var point = map.latLngToContainerPoint(latlng, map.getZoom());
    var size = map.getSize();
    var defaultParams = {
        request: 'GetFeatureInfo', service: 'WMS', srs: 'EPSG:4326', styles: '', transparent: true,
        version: layer.wmsParams.version, format: layer.wmsParams.format, bbox: map.getBounds().toBBoxString(),
        height: size.y, width: size.x, layers: layer.wmsParams.layers, query_layers: layer.wmsParams.layers,
        info_format: 'text/html'
    };
    params = L.Util.extend(defaultParams, params || {});
    params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
    params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);
    return layer._url + L.Util.getParamString(params, layer._url, true);
}