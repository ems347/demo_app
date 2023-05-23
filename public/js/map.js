mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-71.708706,42.163872], 
    zoom: 8,
});


console.log(plastic.image.url);
new mapboxgl.Marker()
.setLngLat(plastic.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<img class="imgPopup" src="${plastic.image[0].url}">
        <p><strong>title: </strong>${plastic.title}<br>
        <strong>description: </strong>${plastic.description}</p>`
    )
)
.addTo(map);