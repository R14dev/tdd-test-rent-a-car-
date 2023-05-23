const Tax = require("../entities/tax");
const Transaction = require("../entities/transaction");
const RepositoryBase = require("../repository/base/repositoryBase");

class CarService {
  constructor({ file }) {
    this.carRepository = new RepositoryBase({ file: file });
    this.basedTax = Tax.taxesBasedOnAge;
    this.currencyFormat = new Intl.NumberFormat("pt-Br", {
      style: "currency",
      currency: "BRL",
    });
  }
  getRandomCategory(list) {
    const lenght = list.length;
    return Math.floor(Math.random() * lenght);
  }
  chosenRandomCar(category) {
    const car = this.getRandomCategory(category.carsId);
    const carIndex = category.carsId[car];
    return carIndex;
  }
  async getAvailableCar(carCategory) {
    const carID = this.chosenRandomCar(carCategory);
    const car = await this.carRepository.find(carID);
    return car;
  }

  calculateFinalPrice(custumer, carCategory, numberOfDays) {
    const { age } = custumer;
    const { price } = carCategory;
    const { then: tax } = this.basedTax.find(
      (tax) => age >= tax.form && age <= tax.to
    );
    const finalPrice = tax * price * numberOfDays;
    return this.currencyFormat.format(finalPrice);
  }
  async rent(custumer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory);
    const finalPrice = this.calculateFinalPrice(
      custumer,
      carCategory,
      numberOfDays
    );

    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dueDate = today.toLocaleDateString("pt-br", options);

    const transaction = new Transaction({
      custumer: custumer,
      car: car,
      amout: finalPrice,
      numberofday: dueDate
    })
    return transaction
  }
}

module.exports = CarService;
