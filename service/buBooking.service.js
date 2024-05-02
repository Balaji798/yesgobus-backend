const axios = require("axios");
const OAuth = require("oauth-1.0a");
const crypto = require('crypto');
const BusBooking = require("../model/busBooking.js");
const City = require("../model/cities.js");
const VrlCity = require("../model/vrlcities.js");
const SrsCity = require("\../model/srscities.js");
const { stages } = require("../utils/stages.js");
 
const sendRequest = async (url, method, data) => {
  try {
    const oauth = OAuth({
      consumer: {
        key: process.env.CUSTOMER_KEY,
        secret: process.env.CUSTOMER_SECRET,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      },
    });
    
    const requestData = {
      url: url,
      method: method,
      data: data,
    };

    const headers = oauth.toHeader(oauth.authorize(requestData));
    
    const response = await axios({
      method: method,
      url: url,
      headers: headers,
      data: data,
    });
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.log(error);
    throw error.message;
  }
};

exports.getCityList = async () => {
  const requestData = {};
  const url = "http://api.seatseller.travel/cities";
  return sendRequest(url, "GET", requestData);
};

exports.getAliasesCity = async () => {
  const requestData = {};
  const url = "http://api.seatseller.travel/aliases";
  return sendRequest(url, "GET", requestData);
};
const searchBus = async (sourceId, destinationId, doj) => {
  const url = `http://api.seatseller.travel/availabletrips?source=${sourceId}&destination=${destinationId}&doj=${doj}`;
  return sendRequest(url, "GET", null);
}
exports.searchBus = async (sourceId, destinationId, doj) => {
  const url = `http://api.seatseller.travel/availabletrips?source=${sourceId}&destination=${destinationId}&doj=${doj}`;
  return sendRequest(url, "GET", null);
};

exports.getSeatLayout = async (id) => {
  const url = `http://api.seatseller.travel/tripdetails?id=${id}`;
  return sendRequest(url, "GET", null);
};

exports.getBpDpDetails = async (id) => {
  const url = `http://api.seatseller.travel/bpdpDetails?id=${id}`;
  return sendRequest(url, "GET", null);
};

exports.getSeatLayoutV2 = async (args) => {
  const url = "http://api.seatseller.travel/tripdetailsV2";
  return sendRequest(url, "POST", args);
};

exports.blockSeat = async (args) => {
  const url = "http://api.seatseller.travel/blockTicket";
  return sendRequest(url, "POST", args);
};

exports.getRTCFareBreakup = async (blockKey) => {
  const url = `http://api.seatseller.travel/rtcfarebreakup?blockKey=${blockKey}`;
  return sendRequest(url, "GET", null);
};

exports.bookSeat = async (blockKey) => {
  const url = `http://api.seatseller.travel/bookticket?blockKey=${blockKey}`;
  return sendRequest(url, "POST", null);
};

exports.cancelTicketData = async (tin) => {
  const url = `http://api.seatseller.travel/cancellationdata?tin=${tin}`;
  return sendRequest(url, "GET", null);
};

exports.cancelTicket = async (args) => {
  const url = `http://api.seatseller.travel/cancelticket`;
  return sendRequest(url, "POST", args);
};

exports.getTicket = async (tin) => {
  const url = `http://api.seatseller.travel/ticket?tin=${tin}`;
  return sendRequest(url, "GET", null);
};

exports.checkBookedTicket = async (blockKey) => {
  const url = `http://api.seatseller.travel/checkBookedTicket?blockKey=${blockKey}`;
  return sendRequest(url, "GET", null);
};

exports.busCancellationInfo = async (from, to) => {
  const url = `http://api.seatseller.travel/busCancellationInfo?from=${from}&to=${to}`;
  return sendRequest(url, "GET", null);
};

exports.getBusFilters = async (args) => {
  try {
    const [sourceCity, destinationCity] = await Promise.all([
      City.findOne({ name: capitalizeFirstLetter(args.sourceCity) }),
      City.findOne({ name: capitalizeFirstLetter(args.destinationCity) }),
    ]);

    const searchResponse = await searchBus(sourceCity.id, destinationCity.id, args.doj);
    const filters = {
      boardingPoints: [],
      droppingPoints: [],
      busPartners: [],
      busType: [],
    };

    searchResponse.availableTrips = Array.isArray(searchResponse.availableTrips)
      ? searchResponse.availableTrips
      : [searchResponse.availableTrips]

    if (searchResponse.availableTrips && searchResponse.availableTrips.length > 0) {
      searchResponse.availableTrips.forEach((bus) => {

        bus.boardingTimes = Array.isArray(bus.boardingTimes)
          ? bus.boardingTimes
          : [bus.boardingTimes]

        bus.droppingTimes = Array.isArray(bus.droppingTimes)
          ? bus.droppingTimes
          : [bus.droppingTimes]

        if (bus.boardingTimes && bus.boardingTimes?.length > 0) {

          bus.boardingTimes?.forEach((point) => {
            filters.boardingPoints.push(point.bpName);
          });
        }
        if (bus.droppingTimes && bus.droppingTimes?.length > 0) {
          bus.droppingTimes?.forEach((point) => {
            filters.droppingPoints.push(point.bpName);
          });
        }
        filters.busPartners.push(bus.travels);
        filters.busType.push(bus.busType);
      });
    }
    filters.boardingPoints = [...new Set(filters.boardingPoints)];
    filters.droppingPoints = [...new Set(filters.droppingPoints)];
    filters.busPartners = [...new Set(filters.busPartners)];
    filters.busType = [...new Set(filters.busType)];
    return {
      status: 200,
      data: filters,
      sourceCity: sourceCity.id,
      destinationCity: destinationCity.id,
    };
  } catch (error) {
    console.log(error)
    throw error.message;
  }
};

function hasFilters(filters) {
  return (
    filters.boardingPoints ||
    filters.droppingPoints ||
    filters.busPartners ||
    filters.minPrice ||
    filters.maxPrice
  );
}


exports.getBusDetails = async (searchArgs, filters) => {
  try {
    const [sourceCity, destinationCity] = await Promise.all([
      City.findOne({ name: capitalizeFirstLetter(searchArgs.sourceCity) }),
      City.findOne({ name: capitalizeFirstLetter(searchArgs.destinationCity) }),
    ]);

    let searchResponse = await searchBus(sourceCity.id, destinationCity.id, searchArgs.doj);
    searchResponse.availableTrips = Array.isArray(searchResponse.availableTrips)
      ? searchResponse.availableTrips
      : [searchResponse.availableTrips]

    searchResponse = searchResponse.availableTrips;

    if (!hasFilters(filters)) {
      return {
        status: 200,
        data: searchResponse,
      };
    }
    const filteredBuses = searchResponse.filter((bus) => {

      bus.boardingTimes = Array.isArray(bus.boardingTimes)
        ? bus.boardingTimes
        : [bus.boardingTimes]

      bus.droppingTimes = Array.isArray(bus.droppingTimes)
        ? bus.droppingTimes
        : [bus.droppingTimes]

      const fareArray = Array.isArray(bus.fares) ? bus.fares : [bus.fares];

      const fareValues = fareArray.map((price) => {
        return parseInt(price, 10);
      });

      const matchingPrice =
        (!filters.minPrice || fareValues.some((fare) => fare >= filters.minPrice)) &&
        (!filters.maxPrice || fareValues.some((fare) => fare <= filters.maxPrice));

      const matchingBoardingPoints = filters.boardingPoints
        ? filters.boardingPoints.some((point) =>
          bus.boardingTimes.some((bPoint) => bPoint.bpName === point)
        )
        : true;

      const matchingDroppingPoints = filters.droppingPoints
        ? filters.droppingPoints.some((point) =>
          bus.droppingTimes.some((dPoint) => dPoint.bpName === point)
        )
        : true;

      const matchingBusPartners = filters.busPartners
        ? filters.busPartners.includes(bus.travels)
        : true;

      const matchingBusType = filters.busTypes
        ? filters.busTypes.includes(bus.busType)
        : true;

      return (
        matchingPrice &&
        matchingBoardingPoints &&
        matchingDroppingPoints &&
        matchingBusPartners &&
        matchingBusType
      );
    });

    return {
      status: 200,
      data: filteredBuses,
    };
  } catch (error) {
    throw error.message;
  }
};

exports.bookBus = async (bookingDetails) => {
  try {
    const booking = new BusBooking({
      ...bookingDetails
    });
    await booking.save();
    return {
      status: 200,
      message: "Booking details added",
      data: booking
    }
  } catch (error) {
    throw error.message;
  }
}

exports.searchCity = async (searchParam) => {
  try {
    const cities = await City.find({
      name: { $regex: `^${searchParam}`, $options: 'i' }
    })
    return {
      status: 200,
      message: "City details retrieved",
      data: cities
    }
  } catch (error) {
    throw error.message;
  }
}

exports.updateBookings = async (bookingId, bookingDetails) => {
  try {
    const updatedBooking = await BusBooking.findOneAndUpdate(
      { _id: bookingId },
      { $set: bookingDetails },
      { new: true }
    );
    if (!updatedBooking) {
      return {
        status: 404,
        message: "Booking not found",
        data: null,
      };
    }
    return {
      status: 200,
      message: "Booking updated",
      data: updatedBooking,
    };
  } catch (error) {
    throw error.message;
  }
};

exports.getBookingById = async (bookingId) => {
  try {
    const booking = await BusBooking.findById(bookingId);
    if (!booking) {
      return {
        status: 404,
        message: "Booking not found",
        data: null,
      };
    }
    // const ticket = await Tickets.findOne(booking.tin);
    // if (!ticket) {
    //   const newTicketData = await getTicket(booking.tin);
    //   if (!newTicketData) {
    //     return {
    //       status: 404,
    //       message: "Booking not found",
    //       data: null,
    //     };
    //   }
    //   const newTicket = new Tickets({
    //     ...newTicketData
    //   });
    //   await newTicket.save();
    // } else {
    return {
      status: 200,
      message: "Booking retrieved",
      data: booking,
      // booking: ticket,
    };
    // }
  } catch (error) {
    throw error.message;
  }
};


exports.getAllBookings = async (userId) => {
  try {
    const booking = await BusBooking.find({ userId: userId, bookingStatus: { $ne: "pending" } },
    { _id: 1, sourceCity: 1, destinationCity: 1, busOperator: 1,busType:1,selectedSeats:1,pickUpTime:1, reachTime:1,  });
    if (!booking) {
      return {
        status: 404,
        message: "Booking not found",
        data: null,
      };
    }
    return {
      status: 200,
      message: "Booking retrieved",
      data: booking,
    };
  } catch (error) {
    throw error.message;
  }
};

const sendVrlRequest = async (url, data) => {
  try {
    data.verifyCall = process.env.VERIFY_CALL;
    const response = await axios({
      method: "POST",
      url: `https://itsplatform.itspl.net/api/${url}`,
      data: data,
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.message;
  }
};
// vrl travels buses
exports.sendVrlRequest = async (url, data) => {
  try {
    data.verifyCall = process.env.VERIFY_CALL;
    const response = await axios({
      method: "POST",
      url: `https://itsplatform.itspl.net/api/${url}`,
      data: data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.message;
  }
};

const capitalizeFirstLetter = (str) => {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// get vrl bus filters
exports.getVrlFilters = async (args) => {
  try {
    const [vrlSourceCity, vrlDesctinationCity] = await Promise.all([
      VrlCity.findOne({ CityName: capitalizeFirstLetter(args.sourceCity) }),
      VrlCity.findOne({ CityName: capitalizeFirstLetter(args.destinationCity) }),
    ]);
    
    const dateParts = args.doj.split('-');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    const requestBody = {
      fromID: parseInt(vrlSourceCity.CityID),
      toID: parseInt(vrlDesctinationCity.CityID),
      journeyDate: formattedDate,
    }
    let searchResponse = await sendVrlRequest("GetAvailableRoutes", requestBody);
    const filters = {
      boardingPoints: [],
      droppingPoints: [],
    };
    if (searchResponse && searchResponse.data && searchResponse.data.AllRouteBusLists) {
      searchResponse.data.AllRouteBusLists.forEach(route => {
        // Extract Boarding Points
        if (route.BoardingPoints) {
          const boardingPointsArray = route.BoardingPoints.split('#');
          for (let i = 0; i < boardingPointsArray.length; i++) {
            const bdPoints = boardingPointsArray[i].split('|')[1];
            filters.boardingPoints.push(bdPoints);
          }
        }

        // Extract Dropping Points
        if (route.DroppingPoints) {
          const droppingPointsArray = route.DroppingPoints.split('#');
          for (let i = 0; i < droppingPointsArray.length; i++) {
            const bdPoints = droppingPointsArray[i].split('|')[1];
            filters.droppingPoints.push(bdPoints);
          }
        }
      });
    }
    return {
      status: 200,
      data: filters,
      sourceCity: vrlSourceCity.CityID,
      destinationCity: vrlDesctinationCity.CityID,
    };
  } catch (error) {
    throw error.message;
  }
};


exports.getVrlBusDetails = async (searchArgs, filters) => {
  try {
    if (filters.busPartners && filters.busPartners.every(partner => partner.trim() !== "VRL Travels")) {
      return {
        status: 200,
        data: [],
      };
    }

    const [vrlSourceCity, vrlDesctinationCity] = await Promise.all([
      VrlCity.findOne({ CityName: capitalizeFirstLetter(searchArgs.sourceCity) }),
      VrlCity.findOne({ CityName: capitalizeFirstLetter(searchArgs.destinationCity) }),
    ]);
    const dateParts = searchArgs.doj.split('-');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    const requestBody = {
      fromID: parseInt(vrlSourceCity.CityID),
      toID: parseInt(vrlDesctinationCity.CityID),
      journeyDate: formattedDate.toString(),
    }
    console.log(requestBody)
    let searchResponse = await sendVrlRequest("GetAvailableRoutes", requestBody);
    searchResponse = searchResponse.data.AllRouteBusLists;
    searchResponse = searchResponse.map((route) => {
      route.type = "vrl";
      const prices = [
        route.AcSeatRate - route.AcSeatServiceTax - route.AcSeatSurcharges,
        route.AcSleeperRate - route.AcSlpServiceTax - route.AcSlpSurcharges,
        route.AcSlumberRate - route.AcSlmbServiceTax - route.AcSlmbSurcharges,
        route.NonAcSeatRate - route.NonAcSeatServiceTax - route.NonAcSeatSurcharges,
        route.NonAcSleeperRate - route.NonAcSlpServiceTax - route.NonAcSlpSurcharges,
        route.NonAcSlumberRate - route.NonAcSlmbServiceTax - route.NonAcSlmbSurcharges,
      ];
      const validPrices = prices.filter(price => price > 0);
      const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;

      route.lowestPrice = lowestPrice;
      route.allPrices = [...new Set(validPrices)];
      return route;
    })

    if (!hasFilters(filters)) {
      return {
        status: 200,
        data: searchResponse,
      };
    }

    const filteredBuses = searchResponse.filter(route => {

      const hasMatchingBoardingPoint = filters.boardingPoints ? route.BoardingPoints?.split('#').some(point => {
        const location = point.split('|')[1];
        return filters.boardingPoints?.some(filterPoint => filterPoint.trim() === location.trim());
      })
        : true;

      const hasMatchingDroppingPoint = filters.droppingPoints ? route.DroppingPoints?.split('#').some(point => {
        const location = point.split('|')[1];
        return filters.droppingPoints?.some(filterPoint => filterPoint === location);
      })
        : true;

      return hasMatchingBoardingPoint && hasMatchingDroppingPoint;
    });

    if (filters.maxPrice || filters.minPrice) {
      const filteredByPrice = filteredBuses.filter(route => {
        const routePrices = route.allPrices || [];
        const validPricesInRange = routePrices.filter(price =>
          (!filters.minPrice || price >= filters.minPrice) &&
          (!filters.maxPrice || price <= filters.maxPrice)
        );

        return validPricesInRange.length > 0;
      });

      return {
        status: 200,
        data: filteredByPrice,
        sourceCity: vrlSourceCity.CityID,
        destinationCity: vrlDesctinationCity.CityID,
      };
    } else {
      return {
        status: 200,
        data: filteredBuses,
        sourceCity: vrlSourceCity.CityID,
        destinationCity: vrlDesctinationCity.CityID,
      };
    }
  } catch (error) {
    throw error.message;
  }
};


const sendSrsRequest = async (url, method, data) => {
  try {
    const headers = {
      'api-key': process.env.SRS_API_KEY,
      'Content-Type': 'application/json',
      'Accept-Encoding': 'application/gzip',
    };
    const response = await axios({
      method: method,
      //test
      // url: `http://gds-stg.ticketsimply.co.in/${url}`,

      //live
      url: `https://gds.ticketsimply.com/${url}`,

      headers: headers,
      data: data,
    });

    return response;
  } catch (error) {
    throw error.message;
  }
};

// srs buses APIS
exports.sendSrsRequest = async (url, method, data) => {
  try {
    const headers = {
      'api-key': process.env.SRS_API_KEY,
      'Content-Type': 'application/json',
      'Accept-Encoding': 'application/gzip',
    };
    const response = await axios({
      method: method,
      //test
      // url: `http://gds-stg.ticketsimply.co.in/${url}`,

      //live
      url: `https://gds.ticketsimply.com/${url}`,

      headers: headers,
      data: data,
    });

    return response;
  } catch (error) {
    throw error.message;
  }
};


exports.getSrsCities = async () => {
  const url = "/gds/api/cities.json";
  const response = await sendSrsRequest(url, "GET");
  const key = response.data.result[0];
  const resultArray = response.data.result?.slice(1).map(row => {
    const obj = {};
    key.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return resultArray;
};

exports.getSrsSchedules = async (origin_id, destination_id, travel_date) => {
  const [srsSourceCity, srsDesctinationCity] = await Promise.all([
    SrsCity.findOne({ name: capitalizeFirstLetter(origin_id) }),
    SrsCity.findOne({ name: capitalizeFirstLetter(destination_id) }),
  ]);
  const url = `/gds/api/schedules/${srsSourceCity.id}/${srsDesctinationCity.id}/${travel_date}.json`;
  const response = await sendSrsRequest(url, "GET");
  const key = response?.data?.result[0];
  let resultArray = response.data.result?.slice(1).map(row => {
    const obj = {};
    key.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  resultArray = resultArray.map(bus => {
    bus.boarding_stages = bus.boarding_stages?.split(',').map(item => {
      const [stage, time] = item.split('|');
      return stages[stage];
    });

    bus.dropoff_stages = bus.dropoff_stages?.split(',').map(item => {
      const [stage, time] = item.split('|');
      return stages[stage];
    });
    bus.type = "srs";
    return bus;
  });

  resultArray = resultArray.reduce((acc, bus) => {
    if (bus.operator_service_name.toLowerCase().startsWith('srs')) {
      acc.unshift(bus);
    } else {
      acc.push(bus);
    }
    return acc;
  }, []);

  return resultArray;
};

exports.getSrsSeatDetails = async (schedule_id) => {
  const url = `/gds/api/schedule/${schedule_id}.json`;
  const response = await sendSrsRequest(url, "GET");
  return response.data;
};

exports.getSrsOperatorSchedules = async (travel_id, travel_date) => {
  const url = `/gds/api/operator_schedules/${travel_id}/${travel_date}.json`;
  const response = await sendSrsRequest(url, "GET");
  const key = response.data.result[0];
  const resultArray = response.data.result?.slice(1).map(row => {
    const obj = {};
    key.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return resultArray;
};

exports.getSrsAvailabilities = async (origin_id, destination_id, travel_date) => {
  const url = `/gds/api/availabilities/${origin_id}/${destination_id}/${travel_date}.json`;
  const response = await sendSrsRequest(url, "GET");
  const key = response.data.result[0];
  const resultArray = response.data.result?.slice(1).map(row => {
    const obj = {};
    key.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return resultArray;
};

exports.getSrsAvailability = async (schedule_id) => {
  const url = `/gds/api/availability/${schedule_id}.json`;
  const response = await sendSrsRequest(url, "GET");
  const key = response.data.result[0];
  const resultArray = response.data.result?.slice(1).map(row => {
    const obj = {};
    key.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return resultArray;
};

exports.getSrsBlockSeat = async (schedule_id, args) => {
  const url = `/gds/api/tentative_booking/${schedule_id}.json`;
  const response = await sendSrsRequest(url, "POST", args);
  return response.data;
};

//pass the ticket number from the block seat response
exports.srsConfirmBooking = async (ticket_number) => {
  const url = `/gds/api/confirm_booking/${ticket_number}.json?api_key=${process.env.SRS_API_KEY}`;
  const response = await sendSrsRequest(url, "POST");
  return response.data;
};

exports.getSrsBookingDetails = async (ticket_number, agent_ref_number) => {
  const url = `/gds/api/booking_details.json?pnr_number=${ticket_number}&agent_ref_number=${agent_ref_number}`;
  const response = await sendSrsRequest(url, "GET");
  return response.data;
};

exports.getSrsCanCancelDetails = async (ticket_number, seat_numbers) => {
  const url = `/gds/api/can_cancel.json?ticket_number=${ticket_number}&seat_numbers=${seat_numbers}`;
  const response = await sendSrsRequest(url, "GET");
  return response.data;
};

exports.srsCancelBooking = async (ticket_number, seat_numbers) => {
  const url = `/gds/api/cancel_booking.json?ticket_number=${ticket_number}&seat_numbers=${seat_numbers}`;
  const response = await sendSrsRequest(url, "GET");
  return response.data;
};

exports.getSrsFilters = async (args) => {
  try {
    let searchResponse = await getSrsSchedules(args.sourceCity, args.destinationCity, args.doj);
    const filteredBuses = searchResponse.filter(bus => bus?.status === "New" || bus.status === "Update");
    const boardingPoints = filteredBuses.flatMap(bus => bus.boarding_stages);
    const droppingPoints = filteredBuses.flatMap(bus => bus.dropoff_stages);
    const busPartners = filteredBuses.map(bus => bus.operator_service_name);
    const uniqueBusPartners = [...new Set(busPartners)];
    return {
      boardingPoints,
      droppingPoints,
      busPartners: uniqueBusPartners,
    };
  } catch (error) {
    throw error.message;
  }
};
