const Plastic = require('../models/plastics');
const mbxGeocoding =  require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require('../utils/cloudinary'); 


module.exports.index = async (req, res) => {
    const plastics = await Plastic.find({})
    res.render('submissions/index', {plastics})
}


module.exports.renderNewSubmissionForm = (req, res) => {
    res.render('submissions/new')
}

module.exports.newSubmission = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.address,
        countries: ['us'],
        limit: 1
      }).send();
    const newPlastic = new Plastic(req.body);
    newPlastic.geometry = geoData.body.features[0].geometry;
    newPlastic.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await newPlastic.save();
    console.log(newPlastic);
    req.flash('success', 'Success!');
    res.redirect(`submissions/${newPlastic._id}`)
}

module.exports.renderSubmission = async (req, res) => {
    const plastic = await Plastic.findById(req.params.id);
    if(!plastic){
        req.flash('error', 'Submission does not exist');
        return res.redirect('./');
    }
    res.render('submissions/show', {plastic})
}

module.exports.renderEditForm = async (req, res) => {
    const plastic = await Plastic.findById(req.params.id);
    res.render('submissions/edit', {plastic})
}

module.exports.editSubmission = async (req, res) => {
    const plastic = await Plastic.findByIdAndUpdate(req.params.id, req.body);
    const latitude = Number(req.body.latitude);
    const longitude = Number(req.body.longitude);
    plastic.geometry.coordinates[1] = latitude;
    plastic.geometry.coordinates[0] = longitude;
    await plastic.save();
    console.log(req.body);
    req.flash('success', 'Success!');
    res.redirect(`./${plastic._id}`)
}

module.exports.deleteSubmission = async (req, res) => {
    const deletedPlastic = await Plastic.findByIdAndDelete(req.params.id);
    req.flash('success', 'Success!');
    res.redirect('./')
}
