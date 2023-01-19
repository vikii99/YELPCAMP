const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

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
            author: '63c3f5a3dfb7ee868232a7a2',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dba8utuyf/image/upload/v1673949664/YelpCamp/efmjzi0pa8lrzm9ggfex.jpg',
                  filename: 'YelpCamp/efmjzi0pa8lrzm9ggfex',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dba8utuyf/image/upload/v1673949664/YelpCamp/uywondst1bmwh0tr7pzo.jpg',
                  filename: 'YelpCamp/uywondst1bmwh0tr7pzo',
                  
                }
              ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae accusamus id cupiditate voluptates accusantium sed velit quidem laudantium quisquam tenetur, ea consectetur! Assumenda provident quasi mollitia perferendis aspernatur esse! Perspiciatis.',
            price,
            geometry: { type: 'Point', coordinates: [ cities[random1000].longitude,
                                                      cities[random1000].latitude ] }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})