const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campgrounds');
require("dotenv").config();


const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";
// 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) +10;
        const camp = new Campground({
          author: "646390e36d0ddd8a53c477d1",
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          images: [
            {
              url: "https://res.cloudinary.com/dba8utuyf/image/upload/v1673945528/samples/landscapes/beach-boat.jpg",
              filename: "samples/landscapes/beach-boat",
            },
            {
              url: "https://res.cloudinary.com/dba8utuyf/image/upload/v1673949664/YelpCamp/uywondst1bmwh0tr7pzo.jpg",
              filename: "YelpCamp/uywondst1bmwh0tr7pzo",
            },
          ],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae accusamus id cupiditate voluptates accusantium sed velit quidem laudantium quisquam tenetur, ea consectetur! Assumenda provident quasi mollitia perferendis aspernatur esse! Perspiciatis.",
          price,
          geometry: {
            type: "Point",
            coordinates: [
              cities[random1000].longitude,
              cities[random1000].latitude,
            ],
          },
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})