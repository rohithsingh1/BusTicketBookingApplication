import dotenv from "dotenv";
import mongoose from "mongoose";
import Bus from "../models/bus.model.js";
import BusOperator from "../models/bus-operator.model.js";
import City from "../models/city.model.js";
import DropPoint from "../models/drop-point.model.js";
import PickupPoint from "../models/pickup-point.model.js";
import Route from "../models/route.model.js";
import Trip from "../models/trip.model.js";

dotenv.config();

const mongoUrl=process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error("MONGO_URL is missing in the environment variables.");
}

const upsertByName=(Model, name, data) =>
  Model.findOneAndUpdate(
    {name},
    {$set: {name, ...data}},
    {returnDocument: "after", upsert: true, runValidators: true}
  );

const upsertBus=(operator, busNumber, data) =>
  Bus.findOneAndUpdate(
    {operator: operator._id, busNumber},
    {$set: {operator: operator._id, busNumber, ...data}},
    {returnDocument: "after", upsert: true, runValidators: true}
  );

const upsertRoute=(sourceCity, destinationCity, data) =>
  Route.findOneAndUpdate(
    {
      sourceCity: sourceCity._id,
      destinationCity: destinationCity._id,
    },
    {
      $set: {
        sourceCity: sourceCity._id,
        destinationCity: destinationCity._id,
        ...data,
      },
    },
    {returnDocument: "after", upsert: true, runValidators: true}
  );

const upsertPoint=(Model, city, name, data) =>
  Model.findOneAndUpdate(
    {city: city._id, name},
    {$set: {city: city._id, name, ...data}},
    {returnDocument: "after", upsert: true, runValidators: true}
  );

const toDate=(value) => new Date(value);

const seed=async () => {
  await mongoose.connect(mongoUrl);

  const [hyderabad, bangalore, chennai]=await Promise.all([
    upsertByName(City, "Hyderabad", {state: "Telangana", country: "India"}),
    upsertByName(City, "Bangalore", {state: "Karnataka", country: "India"}),
    upsertByName(City, "Chennai", {state: "Tamil Nadu", country: "India"}),
  ]);

  const [tgsrtc, flixBus, intrCity, orangeTravels]=await Promise.all([
    upsertByName(BusOperator, "TGSRTC", {
      supportPhone: "040-12345678",
      rating: 4.3,
    }),
    upsertByName(BusOperator, "FlixBus", {
      supportPhone: "080-98765432",
      rating: 4.8,
    }),
    upsertByName(BusOperator, "IntrCity SmartBus", {
      supportPhone: "080-55556666",
      rating: 4.5,
    }),
    upsertByName(BusOperator, "Orange Travels", {
      supportPhone: "040-44445555",
      rating: 4.2,
    }),
  ]);

  const [tgsrtcBus, flixBusHydBlr, intrCityBus, orangeBus]=await Promise.all([
    upsertBus(tgsrtc, "TSRTC-GP-101", {
      name: "Garuda Plus A/C Semi Sleeper",
      isAc: true,
      seatType: "SEATER",
      totalSeats: 45,
    }),
    upsertBus(flixBus, "FLX-HYD-BLR-21", {
      name: "A/C Seater / Sleeper",
      isAc: true,
      seatType: "SEATER_SLEEPER",
      totalSeats: 52,
    }),
    upsertBus(intrCity, "IC-HYD-BLR-22", {
      name: "A/C Sleeper SmartBus",
      isAc: true,
      seatType: "SLEEPER",
      totalSeats: 40,
    }),
    upsertBus(orangeTravels, "ORG-HYD-BLR-20", {
      name: "Non-A/C Seater",
      isAc: false,
      seatType: "SEATER",
      totalSeats: 49,
    }),
  ]);

  const [hyderabadToBangalore, bangaloreToHyderabad, hyderabadToChennai]=
    await Promise.all([
      upsertRoute(hyderabad, bangalore, {distanceKm: 570}),
      upsertRoute(bangalore, hyderabad, {distanceKm: 570}),
      upsertRoute(hyderabad, chennai, {distanceKm: 630}),
    ]);

  const [miyapur, kukatpally, kondapur, nizampet]=await Promise.all([
    upsertPoint(PickupPoint, hyderabad, "Miyapur", {
      address: "Miyapur Metro Station",
    }),
    upsertPoint(PickupPoint, hyderabad, "Kukatpally", {
      address: "Kukatpally Bus Stop",
    }),
    upsertPoint(PickupPoint, hyderabad, "Kondapur", {
      address: "Near Botanical Garden",
    }),
    upsertPoint(PickupPoint, hyderabad, "Nizampet", {
      address: "Nizampet Main Road",
    }),
  ]);

  const [silkBoard, majestic, electronicCity, marathahalli]=await Promise.all([
    upsertPoint(DropPoint, bangalore, "Silk Board", {
      address: "Silk Board Junction",
    }),
    upsertPoint(DropPoint, bangalore, "Majestic", {
      address: "Kempegowda Bus Station",
    }),
    upsertPoint(DropPoint, bangalore, "Electronic City", {
      address: "Electronic City Phase 1",
    }),
    upsertPoint(DropPoint, bangalore, "Marathahalli", {
      address: "Marathahalli Bridge",
    }),
  ]);

  const sampleBuses=[tgsrtcBus, flixBusHydBlr, intrCityBus, orangeBus];
  const sampleRoutes=[
    hyderabadToBangalore,
    bangaloreToHyderabad,
    hyderabadToChennai,
  ];

  await Trip.deleteMany({
    bus: {$in: sampleBuses.map((bus) => bus._id)},
    route: {$in: sampleRoutes.map((route) => route._id)},
  });

  await Trip.insertMany([
    {
      route: hyderabadToBangalore._id,
      bus: flixBusHydBlr._id,
      departureTime: toDate("2026-05-17T21:15:00.000+05:30"),
      arrivalTime: toDate("2026-05-18T10:25:00.000+05:30"),
      basePrice: 951,
      availableSeats: 48,
      status: "SCHEDULED",
      pickupTimes: [
        {point: miyapur._id, time: toDate("2026-05-17T20:30:00.000+05:30")},
        {
          point: kukatpally._id,
          time: toDate("2026-05-17T20:50:00.000+05:30"),
        },
        {point: kondapur._id, time: toDate("2026-05-17T21:05:00.000+05:30")},
      ],
      dropTimes: [
        {point: silkBoard._id, time: toDate("2026-05-18T09:45:00.000+05:30")},
        {point: majestic._id, time: toDate("2026-05-18T10:25:00.000+05:30")},
      ],
    },
    {
      route: hyderabadToBangalore._id,
      bus: intrCityBus._id,
      departureTime: toDate("2026-05-17T22:45:00.000+05:30"),
      arrivalTime: toDate("2026-05-18T11:00:00.000+05:30"),
      basePrice: 1329,
      availableSeats: 32,
      status: "SCHEDULED",
      pickupTimes: [
        {point: nizampet._id, time: toDate("2026-05-17T22:00:00.000+05:30")},
        {
          point: kukatpally._id,
          time: toDate("2026-05-17T22:20:00.000+05:30"),
        },
      ],
      dropTimes: [
        {
          point: electronicCity._id,
          time: toDate("2026-05-18T10:25:00.000+05:30"),
        },
        {point: majestic._id, time: toDate("2026-05-18T11:00:00.000+05:30")},
      ],
    },
    {
      route: hyderabadToBangalore._id,
      bus: tgsrtcBus._id,
      departureTime: toDate("2026-05-17T20:30:00.000+05:30"),
      arrivalTime: toDate("2026-05-18T08:45:00.000+05:30"),
      basePrice: 1203,
      availableSeats: 21,
      status: "SCHEDULED",
      pickupTimes: [
        {point: miyapur._id, time: toDate("2026-05-17T19:45:00.000+05:30")},
        {
          point: kukatpally._id,
          time: toDate("2026-05-17T20:05:00.000+05:30"),
        },
      ],
      dropTimes: [
        {
          point: marathahalli._id,
          time: toDate("2026-05-18T08:05:00.000+05:30"),
        },
        {point: majestic._id, time: toDate("2026-05-18T08:45:00.000+05:30")},
      ],
    },
    {
      route: hyderabadToBangalore._id,
      bus: orangeBus._id,
      departureTime: toDate("2026-05-17T19:00:00.000+05:30"),
      arrivalTime: toDate("2026-05-18T07:30:00.000+05:30"),
      basePrice: 799,
      availableSeats: 0,
      status: "SCHEDULED",
      pickupTimes: [
        {point: kondapur._id, time: toDate("2026-05-17T18:30:00.000+05:30")},
      ],
      dropTimes: [
        {point: silkBoard._id, time: toDate("2026-05-18T07:30:00.000+05:30")},
      ],
    },
    {
      route: hyderabadToBangalore._id,
      bus: flixBusHydBlr._id,
      departureTime: toDate("2026-05-18T21:15:00.000+05:30"),
      arrivalTime: toDate("2026-05-19T10:25:00.000+05:30"),
      basePrice: 999,
      availableSeats: 44,
      status: "SCHEDULED",
      pickupTimes: [
        {point: miyapur._id, time: toDate("2026-05-18T20:30:00.000+05:30")},
      ],
      dropTimes: [
        {point: majestic._id, time: toDate("2026-05-19T10:25:00.000+05:30")},
      ],
    },
    {
      route: hyderabadToChennai._id,
      bus: orangeBus._id,
      departureTime: toDate("2026-05-17T18:30:00.000+05:30"),
      arrivalTime: toDate("2026-05-18T06:00:00.000+05:30"),
      basePrice: 850,
      availableSeats: 28,
      status: "SCHEDULED",
      pickupTimes: [
        {point: miyapur._id, time: toDate("2026-05-17T18:00:00.000+05:30")},
      ],
      dropTimes: [],
    },
  ]);

  console.log("Seeded bus search data successfully.");
  console.log("Try: GET /api/trips/search?from=Hyderabad&to=Bangalore&departureTime=2026-05-17");
};

seed()
  .catch((error) => {
    console.error("Failed to seed bus search data:", error);
    process.exitCode=1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
