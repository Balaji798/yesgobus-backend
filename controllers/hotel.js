const hotelModel = require("../model/hotels");

exports.add_hotel = async (req, res) => {
  try {
    const { hotelName, rating, address, fullAddress } = req.body;
    const hotelData = await hotelModel.create({
      hotelName,
      rating,
      address,
      fullAddress,
    });
    console.log(hotelData);
    return res.status(201).send({
      status: true,
      data: { hotelData },
      message: "Hotel added successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};