const express = require("express");
const axios = require("axios");

exports.getlocation = async (req, res) => {
  try {
    // Validate input
    if (!req.body.latlong || !req.body.latlong.lat || !req.body.latlong.long) {
      console.log('Invalid coordinates provided:', req.body);
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates provided"
      });
    }

    const { lat, long } = req.body.latlong;
    console.log('Received coordinates:', { lat, long });

    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || long < -180 || long > 180) {
      console.log('Invalid coordinate values:', { lat, long });
      return res.status(400).json({
        success: false,
        message: "Invalid coordinate values"
      });
    }

    let location = null;

    // Try OpenCage API first
    try {
      const opencageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=74c89b3be64946ac96d777d08b878d43`;
      console.log('Making request to OpenCage API...');
      
      const response = await axios.get(opencageUrl);
      console.log('OpenCage API response status:', response.status);

      if (response.data && response.data.results && response.data.results.length > 0) {
        const components = response.data.results[0].components;
        console.log('Address components:', components);

        // Extract address components with fallbacks
        const town = components.town || components.city || components.village || '';
        const country = components.country || '';
        const state_district = components.state_district || components.county || '';
        const state = components.state || '';
        const postcode = components.postcode || '';

        // Construct address string, handling missing components
        const addressParts = [
          town,
          state_district,
          state,
          country,
          postcode
        ].filter(Boolean);

        if (addressParts.length > 0) {
          location = addressParts.join(", ");
          console.log('OpenCage location string:', location);
        }
      }
    } catch (opencageError) {
      console.error("OpenCage API error:", opencageError.message);
    }

    // If OpenCage failed, try Nominatim
    if (!location) {
      try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
        console.log('Making request to Nominatim API...');
        
        const response = await axios.get(nominatimUrl, {
          headers: {
            'User-Agent': 'MomsMagicFoodDeliveryApp/1.0'
          }
        });

        if (response.data && response.data.display_name) {
          location = response.data.display_name;
          console.log('Nominatim location string:', location);
        }
      } catch (nominatimError) {
        console.error("Nominatim API error:", nominatimError.message);
      }
    }

    // If both services failed, use generic location
    if (!location) {
      location = `Location at ${lat.toFixed(4)}, ${long.toFixed(4)}`;
      console.log('Using generic location:', location);
    }

    return res.json({
      success: true,
      location: location
    });

  } catch (error) {
    console.error("Geocoding error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to process location data. Please try again or enter location manually."
    });
  }
};
