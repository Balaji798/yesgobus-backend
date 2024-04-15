const destinationModel = require("../model/destination");
const packageModel = require("../model/packages");
const wishlistModel = require("../model/wishlist");

exports.add_destination = async (req, res) => {
  try {
    const response = await destinationModel.create({
      destination: req.body.destination,
      image: req.body.image,
      rating: req.body.rating,
      duration: req.body.duration,
      startingPrice: req.body.startingPrice,
    });
    return res.status(201).send({
      status: true,
      data: { response },
      message: "destination created successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

exports.add_packages = async (req, res) => {
  try {
    const { name, price, duration, destinationID, totalDuration, image } =
      req.body;

    const destinationData = await destinationModel.findOne({
      _id: destinationID,
    });
    const package = await packageModel.create({
      name,
      image,
      duration,
      witheFlitePrice: price,
      withoutFlitePrice: price * 0.8,
      destination: destinationData.destination,
      destinationID,
      totalDuration,
    });
    return res.status(201).send({
      status: true,
      data: { package },
      message: "destination created successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
exports.get_packages = async (req, res) => {
  try {
    const destination = await destinationModel.find(
      {},
      {
        _id: 1,
        destination: 1,
        duration: 1,
        startingPrice: 1,
        image: 1,
        rating: 1,
      }
    );
    return res.status(201).send({
      status: true,
      data: { destination: destination },
      message: "destination fetch successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

exports.popular_destinations = async (req, res) => {
  try {
    console.log(req.body.destination);
    const packages = await packageModel.find({
      destination: req.body.destination,
    });
    const wishlist = await wishlistModel.find({ userId: req.user });

    const updatedData2 = packages.map((item) => {
      const { _doc } = item; // Destructure _doc
      const isWishlisted = wishlist.some(
        (dataItem) => dataItem.packageId === _doc._id
      );
      return { ..._doc, isWishlisted }; // Combine _doc with other properties and add isWishlisted
    });
    return res.status(200).send({
      status: true,
      data: { packages: updatedData2 },
      message: "packages fetch successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

exports.add_to_wishlist = async (req, res) => {
  try {
    const wishlistData = await wishlistModel.findOne({
      packageId: req.body.packageId,
      userId: req.user,
    });
    if (!wishlistData) {
      const wishlist = await wishlistModel.create({
        userId: req.user,
        packageId: req.body.packageId,
        isWishlisted: req.body.isWishlisted,
      });
      console.log(wishlist);
      return res.status(200).send({
        status: true,
        data: { wishlist },
        message: "Package added to wishlist successfully",
      });
    } else {
      const wishlist = await wishlistModel.findOneAndUpdate(
        { packageId: req.body.packageId, userId: req.user },
        { isWishlisted: req.body.isWishlisted },
        { new: true }
      );
      console.log(wishlist);
      return res.status(200).send({
        status: true,
        data: { wishlist },
        message: "Package added to wishlist successfully",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

exports.get_user_wishlist = async (req, res) => {
  try {
    const wishlist = await wishlistModel
      .find({ userId: req.userId, isWishlisted: true })
      .populate({
        path: "packageId",
      });
    console.log(wishlist);
    const modifiedData = wishlist.map((item) => {
      const {
        "packageId._id": _id,
        "packageId.name": name,
        "packageId.destinationID": destinationID,
        "packageId.destination": destination,
        "packageId.image": image,
        "packageId.duration": duration,
        "packageId.witheFlitePrice": witheFlitePrice,
        "packageId.withoutFlitePrice": withoutFlitePrice,
        "packageId.totalDuration": totalDuration,
        "packageId.hotelId": hotelId,
        isWishlisted,
        userId
      } = item;
      return {
        _id,
        name,
        destinationID,
        destination,
        image,
        duration,
        witheFlitePrice,
        withoutFlitePrice,
        totalDuration,
        hotelId,
        isWishlisted,
        userId
      };
    });
    console.log(modifiedData)
    return res.status(200).send({
      status: true,
      data: { wishlist:modifiedData },
      message: "wishlist data fetch successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
