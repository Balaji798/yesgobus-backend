const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking");
const middleware = require("../middleware/authenticateUser");

router.post("/book_hotel",middleware.authenticateToken,bookingController.make_booking);
router.post("/add_itinerary_plans",bookingController.add_itinerary_plans)
router.post("/itinerary_plans",bookingController.get_Itinerary_plans )
module.exports = router;