const mongoose = require('mongoose');
const { plasticSchema } = require('../schemas');
const Schema = mongoose.Schema; 

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const opts = { toJSON: { virtuals: true } };

const plasticsSchema = mongoose.Schema({
    image: [ImageSchema],
    description: String,
    title: String,
    address: String,
    muni: String,
    notes: String,
    latitude: Number,
    longitude: Number,
    geometry: {
        type: {
          type: String,
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
}, opts);

plasticsSchema.virtual('properties.popUpMarker').get(function()  {
  return `<img class="imgPopup" src="${this.image[0].url}">
  <p><strong>Title: </strong>${this.title}<br>
  <strong>Description: </strong>${this.description}</p>`
}) // this is the pop up on the map 

module.exports = mongoose.model('Plastic', plasticsSchema);