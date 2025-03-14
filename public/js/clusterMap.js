mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [160.216619,-28.322509], // center the map view 
    zoom: 4,  
});

map.on('load', () => {
    map.addSource('plastics', {
    type: 'geojson',
    data: plastics,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 30 // Radius of each cluster when clustering points (defaults to 50)
    });
     
    map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'plastics',
    filter: ['has', 'point_count'],
    paint: {
    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 100
    //   * Yellow, 30px circles when point count is between 100 and 750
    //   * Pink, 40px circles when point count is greater than or equal to 750
    'circle-color': [
    'step',
    ['get', 'point_count'],
    '#962DEE',
    100,
    '#962DEE',
    750,
    '#962DEE'
    ],
    'circle-radius': [
    'step',
    ['get', 'point_count'],
    20,
    100,
    30,
    750,
    40
    ]
    }
    });
     
    map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'plastics',
    filter: ['has', 'point_count'],
    layout: {
    'text-field': ['get', 'point_count_abbreviated'],
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
    }
    });
     
    map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'plastics',
    filter: ['!', ['has', 'point_count']],
    paint: {
    'circle-color': '#962DEE',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
    }
    });
     
    // inspect a cluster on click
    map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('plastics').getClusterExpansionZoom(
    clusterId,
    (err, zoom) => {
    if (err) return;
     
    map.easeTo({
    center: features[0].geometry.coordinates,
    zoom: zoom
    });
    }
    );
    });
    

    map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const text = e.features[0].properties.popUpMarker;
     
    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup({
        offset: 25,
        draggable: true
    })
    .setLngLat(coordinates)
    .setHTML(
            text
        )
    .addTo(map);
    });
     
    map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
    });
    });