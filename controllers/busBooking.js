const {
  getCityList,
  getAliasesCity,
  searchBus,
  getSeatLayout,
  getBpDpDetails,
  getSeatLayoutV2,
  blockSeat,
  getRTCFareBreakup,
  bookSeat,
  cancelTicketData,
  cancelTicket,
  getTicket,
  checkBookedTicket,
  busCancellationInfo,
  getBusFilters,
  getBusDetails,
  bookBus,
  searchCity,
  updateBookings,
  getBookingById,
  getAllBookings,
  //vrl buses
  sendVrlRequest,
  getVrlFilters,
  getVrlBusDetails,

  //srs buses
  getSrsCities,
  getSrsSchedules,
  getSrsSeatDetails,
  getSrsOperatorSchedules,
  getSrsAvailabilities,
  getSrsAvailability,
  getSrsBlockSeat,
  srsConfirmBooking,
  getSrsBookingDetails,
  getSrsCanCancelDetails,
  srsCancelBooking,
  getSrsFilters,
} = require("../service/buBooking.service.js");
const { sendMessage, sendMail } = require("../utils/helper.js");

exports.getCityListController = async (req, res) => {
  try {
    const response = await getCityList();
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting city list",
      error: error,
    });
  }
};

exports.getAliasesCityController = async (req, res) => {
  try {
    const response = await getAliasesCity();
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting aliases city list",
      error: error,
    });
  }
};

exports.searchBusController = async (req, res) => {
  try {
    const response = await searchBus(
      req.body.sourceCity,
      req.body.destinationCity,
      req.body.doj
    );
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while searching bus details",
      error: error,
    });
  }
};

exports.getSeatLayoutController = async (req, res) => {
  try {
    const response = await getSeatLayout(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting seat layout",
      error: error,
    });
  }
};

exports.getBpDpDetailsController = async (req, res) => {
  try {
    const response = await getBpDpDetails(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting bpdp details",
      error: error,
    });
  }
};

exports.getSeatLayoutV2Controller = async (req, res) => {
  try {
    const response = await getSeatLayoutV2(req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting seat layout v2",
      error: error,
    });
  }
};

exports.blockSeatController = async (req, res) => {
  try {
    const response = await blockSeat(req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while blocking seat",
      error: error,
    });
  }
};

exports.getRTCFareBreakupController = async (req, res) => {
  try {
    const response = await getRTCFareBreakup(req.params.blockKey);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting rtcfarebreakup details",
      error: error,
    });
  }
};

exports.bookSeatController = async (req, res) => {
  try {
    const response = await bookSeat(req.params.blockKey);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while booking seat",
      error: error,
    });
  }
};

exports.cancelTicketDataController = async (req, res) => {
  try {
    const response = await cancelTicketData(req.params.tin);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting cancel ticket data",
      error: error,
    });
  }
};

exports.cancelTicketController = async (req, res) => {
  try {
    const response = await cancelTicket(req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while cancelling ticket",
      error: error,
    });
  }
};

exports.getTicketController = async (req, res) => {
  try {
    const response = await getTicket(req.params.tin);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting ticket data",
      error: error,
    });
  }
};

exports.checkBookedTicketController = async (req, res) => {
  try {
    const response = await checkBookedTicket(req.params.blockKey);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while checking booked ticket",
      error: error,
    });
  }
};

exports.busCancellationInfoController = async (req, res) => {
  try {
    const response = await busCancellationInfo(req.params.from, req.params.to);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting bus cancellation info",
      error: error,
    });
  }
};

exports.getBusFiltersController = async (req, res) => {
  try {
    const response = await getBusFilters(req.query);
    res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting filters",
    });
  }
};

exports.getBusDetailsController = async (req, res) => {
  try {
    const searchArgs = {
      sourceCity: req.body.sourceCity,
      destinationCity: req.body.destinationCity,
      doj: req.body.doj,
    };
    let filters = {};
    if (
      req.body.boardingPoints !== null &&
      req.body.boardingPoints?.length > 0
    ) {
      filters.boardingPoints = req.body.boardingPoints;
    }
    if (
      req.body.droppingPoints !== null &&
      req.body.droppingPoints?.length > 0
    ) {
      filters.droppingPoints = req.body.droppingPoints;
    }
    if (req.body.busPartners !== null && req.body.busPartners?.length > 0) {
      filters.busPartners = req.body.busPartners;
    }
    if (req.body.busTypes !== null && req.body.busTypes?.length > 0) {
      filters.busTypes = req.body.busTypes;
    }
    if (req.body.minPrice !== null && req.body.minPrice !== undefined) {
      filters.minPrice = req.body.minPrice;
    }
    if (req.body.maxPrice !== null && req.body.maxPrice !== undefined) {
      filters.maxPrice = req.body.maxPrice;
    }
    const response = await getBusDetails(searchArgs, filters);
    res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting bus details with filters",
    });
  }
};

exports.bookBusController = async (req, res) => {
  try {
    const response = await bookBus(req.body);
    res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while booking bus",
    });
  }
};

exports.searchCityController = async (req, res) => {
  try {
    const response = await searchCity(req.params.searchParam);
    res.status(response.status).send(response);
    return res.status(response.status).send({status:true,cityList:response.data,message:"City details retrieved",})
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      data: { errorMessage: error.message },
      message: "server error",
    });
  }
};

exports.updateBookingsController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const response = await updateBookings(bookingId, req.body);
    res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while updating booking details",
    });
  }
};

exports.getBookingByIdController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const response = await getBookingById(bookingId);
    res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting booking details",
    });
  }
};

exports.getAllBookingsController = async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await getAllBookings(userId);
    res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting booking details",
    });
  }
};

exports.sendBookingConfirmationMessage = async (req, res) => {
  try {
    const {
      fullName,
      opPNR,
      doj,
      sourceCity,
      destinationCity,
      seats,
      amount,
      pickUpLocation,
      to,
      contact,
    } = req.body;
    const truncatedPickupLocation =
      pickUpLocation.length > 15
        ? pickUpLocation.substring(0, 15) + "..."
        : pickUpLocation;

    const contactNumbers = contact.split(" ");
    const selectedContacts = contactNumbers.slice(0, 2).join(" ");

    const message = `Dear ${fullName} Your PNR: ${opPNR} Journey: ${sourceCity} to  ${destinationCity} Seat: ${seats} Amount Rs.${amount} Date: ${doj} Contact: ${selectedContacts} Pickup: ${truncatedPickupLocation} Is Booked. Thank You, Shine Gobus`;
    const templateId = process.env.BOOKING_CONFIRMATION_TEMPLATE_ID;
    const response = await sendMessage(message, to, templateId);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while sending sms",
    });
  }
};

exports.sendBookingConfirmationEmail = async (req, res) => {
  try {
    const {
      fullName,
      opPNR,
      doj,
      sourceCity,
      destinationCity,
      seats,
      amount,
      pickUpLocation,
      to,
      contact,
    } = req.body;
    const message = `Dear ${fullName},
      Your PNR: ${opPNR}
      Journey: ${sourceCity} to  ${destinationCity}
      Contact: ${contact}
      Seat: ${seats}
      Amount Rs.${amount}
      Date: ${doj}
      Email: ${to}
      Pickup: ${pickUpLocation} Is Booked.
      Thank You, Shine Gobus`;
    const subject = "Booking Confirmation";
    await sendMail(to, subject, message);

    //send mail to yesgobus
    const adminMailMessage = `New Bus Booking:
      Name: ${fullName},
      PNR: ${opPNR}
      Contact: ${contact}
      Journey: ${sourceCity} to  ${destinationCity}
      Seat: ${seats}
      Amount Rs.${amount}
      Date: ${doj}
      Email: ${to}
      Pickup: ${pickUpLocation} Is Booked.
      Thank You, Shine Gobus`;
    const adminSubject = "New Bus Booking";
    // await sendMail("yesgobus99@gmail.com", adminSubject, adminMailMessage);
    await sendMail("support@yesgobus.com", adminSubject, adminMailMessage);
    res.status(200).send({
      status: 200,
      message: "Email Sent",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while sending mail",
    });
  }
};

exports.sendCancelTicketMessage = async (req, res) => {
  try {
    const { fullName, opPNR, sourceCity, destinationCity, to } = req.body;
    const message = `Dear ${fullName} Your PNR: ${opPNR} Journey: ${sourceCity} to  ${destinationCity} is Cancelled. Thank You, Shine Gobus`;
    const templateId = process.env.BOOKING_CANCELLATION_TEMPLATE_ID;
    const response = await sendMessage(message, to, templateId);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while sending sms",
    });
  }
};

exports.sendCancelTicketEmail = async (req, res) => {
  try {
    const { fullName, opPNR, sourceCity, destinationCity, to } = req.body;
    const messageBody = `Dear ${fullName} 
      Your PNR: ${opPNR} 
      Journey: ${sourceCity} to  ${destinationCity} is Cancelled. 
      Thank You, Shine Gobus`;
    const subject = "Booking Cancelled";
    await sendMail(to, subject, messageBody);

    //send mail to yesgobus
    const adminMessageBody = `Name: ${fullName} 
      PNR: ${opPNR} 
      Journey: ${sourceCity} to  ${destinationCity} is Cancelled. 
      Thank You, Shine Gobus`;
    const adminSubject = "Booking Cancelled";
    await sendMail("yesgobus99@gmail.com", adminSubject, adminMessageBody);

    res.status(200).send({
      status: 200,
      message: "Email Sent",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while sending mail",
    });
  }
};

//vrl travels buses
exports.sendVrlRequestController = async (req, res) => {
  try {
    const url = req.params.url;
    const response = await sendVrlRequest(url, req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

//vrl filters
exports.getVrlFiltersController = async (req, res) => {
  try {
    const response = await getVrlFilters(req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting filters",
      error: error,
    });
  }
};

exports.getVrlBusDetailsController = async (req, res) => {
  try {
    const searchArgs = {
      sourceCity: req.body.sourceCity,
      destinationCity: req.body.destinationCity,
      doj: req.body.doj,
    };
    let filters = {};
    if (
      req.body.boardingPoints !== null &&
      req.body.boardingPoints?.length > 0
    ) {
      filters.boardingPoints = req.body.boardingPoints;
    }
    if (
      req.body.droppingPoints !== null &&
      req.body.droppingPoints?.length > 0
    ) {
      filters.droppingPoints = req.body.droppingPoints;
    }
    if (req.body.busPartners !== null && req.body.busPartners?.length > 0) {
      filters.busPartners = req.body.busPartners;
    }
    if (req.body.minPrice !== null && req.body.minPrice !== undefined) {
      filters.minPrice = req.body.minPrice;
    }
    if (req.body.maxPrice !== null && req.body.maxPrice !== undefined) {
      filters.maxPrice = req.body.maxPrice;
    }
    const response = await getVrlBusDetails(searchArgs, filters);
    res.status(response.status).send(response);
  } catch (error) {
    // console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting bus details with filters",
    });
  }
};

//vrl travels buses
exports.getSrsCitiesController = async (req, res) => {
  try {
    const response = await getSrsCities();
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.getSrsSchedulesController = async (req, res) => {
  try {
    const { origin_id, destination_id, travel_date } = req.params;
    const response = await getSrsSchedules(
      origin_id,
      destination_id,
      travel_date
    );
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.getSrsSeatDetailsController = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const response = await getSrsSeatDetails(schedule_id);
    if (req.params.type === "seat") {
      const seatsArray = response.result.bus_layout.available.split(",");
      // Map over the array to create the desired format
      const formattedSeats = seatsArray.map((seat) => {
        const [seatNumber, price] = seat.split("|");
        return { seatNumber, price: parseFloat(price) };
      });

      // Separate the seats into upper and lower seats
      const upperSeats = formattedSeats.filter((seat) =>
        seat.seatNumber.endsWith("U")
      );
      const lowerSeats = formattedSeats.filter((seat) =>
        seat.seatNumber.endsWith("L")
      );

      return res.status(200).send({
        status: true,
        seats: { upperSeats, lowerSeats },
        message: "Seat fetched successfully",
      });
    }
    if (req.params.type === "location") {
      const pickupStages =
        response.result.bus_layout.boarding_stages.split("~");

      // Initialize an empty array to store the extracted data
      const pickupExtractedData = [];

      // Loop through each stage and extract the required information
      pickupStages.forEach((stage) => {
        const data = stage.split("|"); // Split the stage by '|'
        const pickupTime = data[1];
        const pickupPoint = data[5].split(" ")[0]; // Extract the main location name
        const pickupTitle = data[2];
        const pickupAdd = data[3];

        // Push the extracted data into the array
        pickupExtractedData.push({
          pickupTime,
          pickupPoint,
          pickupTitle,
          pickupAdd,
        });
      });

      console.log(pickupExtractedData);

      const dropStages = response.result.bus_layout.dropoff_stages.split("|");

      // Initialize an empty array to store the extracted data
      const dropExtractedData = [];
      dropStages.forEach((stage) => {
        // Extract the required information
        //const data = stage.split("|");
        const dropTime = stage[1];
        const dropPoint = stage[5];
        const dropTitle = stage[2];
        const dropAdd = stage[3]; 

        // Push the extracted data into the array
        dropExtractedData.push({ dropTime, dropPoint, dropTitle, dropAdd });
      });
      console.log(dropExtractedData, dropStages);
      return res.status(200).send({
        status: true,
        seats: {
          pickupPoints: pickupExtractedData,
          dropPoints: dropExtractedData,
        },
        message: "Seat fetched successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.getSrsOperatorSchedulesController = async (req, res) => {
  try {
    const { travel_id, travel_date } = req.params;
    const response = await getSrsOperatorSchedules(travel_id, travel_date);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.getSrsAvailabilitiesController = async (req, res) => {
  try {
    const { origin_id, destination_id, travel_date } = req.params;
    const response = await getSrsAvailabilities(
      origin_id,
      destination_id,
      travel_date
    );
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.getSrsAvailabilityController = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const response = await getSrsAvailability(schedule_id);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.getSrsBlockSeatController = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const response = await getSrsBlockSeat(schedule_id, req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.srsConfirmBookingController = async (req, res) => {
  try {
    const { ticket_number } = req.params;
    const response = await srsConfirmBooking(ticket_number);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.getSrsBookingDetailsController = async (req, res) => {
  try {
    const { ticket_number, agent_ref_number } = req.params;
    const response = await getSrsBookingDetails(
      ticket_number,
      agent_ref_number
    );
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.getSrsCanCancelDetailsController = async (req, res) => {
  try {
    const { ticket_number, seat_numbers } = req.params;
    const response = await getSrsCanCancelDetails(ticket_number, seat_numbers);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.srsCancelBookingController = async (req, res) => {
  try {
    const { ticket_number, seat_numbers } = req.params;
    const response = await srsCancelBooking(ticket_number, seat_numbers);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.getSrsFiltersController = async (req, res) => {
  try {
    const response = await getSrsFilters(req.query);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "An error occurred while getting filters",
    });
  }
};

exports.getSrsSchedulesController = async (req, res) => {
  try {
    const { origin_id, destination_id, travel_date } = req.params;
    const response = await getSrsSchedules(
      origin_id,
      destination_id,
      travel_date
    );
    const data = response?.map((item) => {
      const [type] = item.bus_type
        ?.split(",")
        .filter((type) => type.includes("AC") || type.includes("Non-AC"));
      const price = item.show_fare_screen.split("/")[0];
      return {
        id: item.id,
        operatorName: item.operator_service_name,
        type,
        bus_type: item.bus_type,
        dep_time: item.dep_time,
        arr_time: item.arr_time,
        duration: `${item.duration.split(":")[0]}hr ${
          item.duration.split(":")[1]
        }mins`,
        available_seats: item.available_seats,
        total_seats: item.total_seats,
        price,
        ratings: 0,
        avg: 0,
        trip_id: item.trip_id,
        schedule_id: item.op_schedule_id,
        is_ac_bus: item.is_ac_bus,
        allow_reschedule: item.allow_reschedule,
        src_type: item.type,
      };
    });
    res
      .status(200)
      .send({ status: true, busData: data, message: "Bus fetch successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.get_shorted_bus = async (req, res) => {
  try {
    const { origin_id, destination_id, travel_date } = req.body;
    const response = await getSrsSchedules(
      origin_id,
      destination_id,
      travel_date
    );
    const data = response?.map((item) => {
      const [type] = item.bus_type
        ?.split(",")
        .filter((type) => type.includes("AC") || type.includes("Non-AC"));
      const price = item.show_fare_screen.split("/")[0];
      return {
        id: item.id,
        operatorName: item.operator_service_name,
        type,
        bus_type: item.bus_type,
        dep_time: item.dep_time,
        arr_time: item.arr_time,
        duration: `${item.duration.split(":")[0]}hr ${
          item.duration.split(":")[1]
        }mins`,
        available_seats: item.available_seats,
        total_seats: item.total_seats,
        price,
        ratings: 0,
        avg: 0,
        id: item.id,
      };
    });
    res
      .status(200)
      .send({ status: true, busData: data, message: "Bus fetch successfully" });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: err,
    });
  }
};

exports.sendVrlRequestController = async (req, res) => {
  try {
    const url = req.params.url;
    const response = await sendVrlRequest(url, req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};
