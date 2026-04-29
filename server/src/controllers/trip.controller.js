import Bus from "../models/bus.model.js";
import BusOperator from "../models/bus-operator.model.js";
import City from "../models/city.model.js";
import DropPoint from "../models/drop-point.model.js";
import PickupPoint from "../models/pickup-point.model.js";
import Route from "../models/route.model.js";
import Trip from "../models/trip.model.js";

const escapeRegex=(value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findCityByName=(name) =>
  City.findOne({
    name: new RegExp(`^${escapeRegex(name)}$`, "i"),
  });

const parseTravelDayRange=(value) => {
  const rawValue=String(value||"").trim();
  const datePart=rawValue.slice(0, 10);
  const dateOnlyPattern=/^\d{4}-\d{2}-\d{2}$/;

  if (!dateOnlyPattern.test(datePart)) {
    return null;
  }

  const start=new Date(`${datePart}T00:00:00.000+05:30`);
  const end=new Date(start);
  end.setUTCDate(end.getUTCDate()+1);

  return {start, end};
};

const formatStopTimes=(stopTimes=[]) =>
  stopTimes.map((stopTime) => ({
    name: stopTime.point?.name,
    address: stopTime.point?.address,
    time: stopTime.time,
  }));

const formatTrip=(trip) => ({
  tripId: trip._id,
  operator: {
    id: trip.bus.operator._id,
    name: trip.bus.operator.name,
    rating: trip.bus.operator.rating,
    supportPhone: trip.bus.operator.supportPhone,
  },
  bus: {
    id: trip.bus._id,
    name: trip.bus.name,
    busNumber: trip.bus.busNumber,
    isAc: trip.bus.isAc,
    seatType: trip.bus.seatType,
    totalSeats: trip.bus.totalSeats,
  },
  route: {
    id: trip.route._id,
    from: trip.route.sourceCity.name,
    to: trip.route.destinationCity.name,
    distanceKm: trip.route.distanceKm,
  },
  departureTime: trip.departureTime,
  arrivalTime: trip.arrivalTime,
  durationMinutes: Math.round((trip.arrivalTime-trip.departureTime)/(1000*60)),
  basePrice: trip.basePrice,
  availableSeats: trip.availableSeats,
  status: trip.status,
  pickupPoints: formatStopTimes(trip.pickupTimes),
  dropPoints: formatStopTimes(trip.dropTimes),
});

export const searchTrips=async (req, res) => {
  try {
    const from=String(req.query.from||"").trim();
    const to=String(req.query.to||"").trim();
    const departureValue=req.query.departureTime||req.query.departureDate;
    const travelDayRange=parseTravelDayRange(departureValue);

    if (!from||!to||!departureValue) {
      return res.status(400).json({
        success: false,
        message: "from, to, and departureTime are required query parameters.",
      });
    }

    if (!travelDayRange) {
      return res.status(400).json({
        success: false,
        message:
          "departureTime must include a date in YYYY-MM-DD format, for example 2026-05-17.",
      });
    }

    const [sourceCity, destinationCity]=await Promise.all([
      findCityByName(from),
      findCityByName(to),
    ]);

    if (!sourceCity||!destinationCity) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const route=await Route.findOne({
      sourceCity: sourceCity._id,
      destinationCity: destinationCity._id,
    });

    if (!route) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const trips=await Trip.find({
      route: route._id,
      departureTime: {
        $gte: travelDayRange.start,
        $lt: travelDayRange.end,
      },
      status: "SCHEDULED",
    })
      .populate({
        path: "route",
        populate: [
          {path: "sourceCity", model: City},
          {path: "destinationCity", model: City},
        ],
      })
      .populate({
        path: "bus",
        populate: {path: "operator", model: BusOperator},
        model: Bus,
      })
      .populate({path: "pickupTimes.point", model: PickupPoint})
      .populate({path: "dropTimes.point", model: DropPoint})
      .sort({departureTime: 1});

    return res.status(200).json({
      success: true,
      count: trips.length,
      data: trips.map(formatTrip),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message||"Unable to search trips.",
    });
  }
};
