const {  join } = require("path");
const car = require("../src/entities/car");
const carCategory = require("../src/entities/carCategory");
const custumer = require("../src/entities/custumers");
const { writeFile } = require("fs/promises");
const seedBase = join(__dirname, "../", "database");
const { faker } = require("@faker-js/faker");
const ITEAMS = 2;


const category = new carCategory({
  id: faker.number.int(),
  name: faker.vehicle.type(),
  carsId: [],
  price: faker.finance.amount(20, 100),
});

const write = (filename, data) => {
  try {
    writeFile(join(seedBase, filename), JSON.stringify(data), {
    encoding: "utf8",
    flag: "w",
    mode: 0o666,
  });
    
  } catch (error) {
    console.log(error);
  }
  
};

const cars = [];
const custumers = [];

for (let index = 0; index <= ITEAMS; index++) {
  const Car = new car({
    id: faker.number.int(),
    name: faker.vehicle.model(),
    releaseYear: faker.date.anytime(),
    available:true,
    gasAvailable:true
  });

  category.carsId.push(Car.id);
  const Custumer = new custumer({
    id: faker.number.int(),
    name: faker.person.fullName(),
    age: (new Date(faker.date.birthdate({ min: 18, max: 50, mode: "age" })).getFullYear() - 2023) * -1,
  });

  cars.push(Car);
  custumers.push(Custumer);
}

(async () => {
  await write("cars.json", cars);
  await write("custumers.json", custumers);
  await write("carCategory.json", [category]);
})();
