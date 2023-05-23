const { expect } = require("chai");
const { before, beforeEach, afterEach, describe, it } = require("mocha");
const CarService = require("../../src/services/CarServices");
const { join } = require("path");
const dataBase = join(__dirname, "../../database", "cars.json");
const sinon = require("sinon");
const Transaction = require("../../src/entities/transaction");

const mocks = {
  validCar: require("../mocks/valid-car.json"),
  validCategory: require("../mocks/valid-category.json"),
  validCustumer: require("../mocks/valid-user.json"),
  carValid: require("../../database/cars.json"),
};

describe("car service suite", () => {
  let carServies = {};
  let sandobox = {};
  before(() => {
    carServies = new CarService({ file: dataBase });
  });
  beforeEach(() => {
    sandobox = sinon.createSandbox();
  });

  afterEach(() => {
    sandobox.restore();
  });

  it("retorna categoria de carro disponivel por id aleatoriamente", async () => {
    const carValid = mocks.validCar;
    const carCategory = mocks.validCategory;
    carCategory.carsId = [carValid.id];

    sandobox
      .stub(carServies.carRepository, carServies.carRepository.find.name)
      .resolves(carValid);
    sandobox.spy(carServies, carServies.chosenRandomCar.name);
    const result = await carServies.getAvailableCar(carCategory);
    const expecteds = carValid;

    expect(carServies.chosenRandomCar.calledOnce).to.be.ok;
    expect(carServies.carRepository.find.calledWithExactly(carValid.id)).to.be
      .ok;
    expect(result).to.be.deep.equal(expecteds);
  });

  it("retorna um iten from array aleatoriamente", async () => {
    const data = [1, 2, 4, 5, 6, 7, 8, 9];
    const result = await carServies.getRandomCategory(data);
    expect(result).to.be.lte(data.length).and.be.gte(0);
  });
  it("escolha o primeiro id da categoria", async () => {
    const carCategory = mocks.validCategory;
    const cardIdIndex = 0;
    sandobox
      .stub(carServies, carServies.getRandomCategory.name)
      .returns(cardIdIndex);
    const chosenCategoryRandom = carServies.chosenRandomCar(carCategory);
    const expecteds = carCategory.carsId[cardIdIndex];
    expect(carServies.getRandomCategory.calledOnce).to.be.ok;
    expect(chosenCategoryRandom).to.be.equal(expecteds);
  });

  it("apresenta uma categoria, e um cliente e o numero de dias e calcula o valor final ", () => {
    const validCustumer = mocks.validCustumer;
    validCustumer.age = 50;

    const carCategory = mocks.validCategory;
    carCategory.price = 37.6;

    const numberOfDays = 5;

    const expecteds = carServies.currencyFormat.format(244.4);

    /*sandobox
      .stub(carServies, "basedTax")
      .get(() => { from: 40, to: 50, then: 1.3 }); */
    const result = carServies.calculateFinalPrice(
      validCustumer,
      carCategory,
      numberOfDays
    );

    expect(result).to.be.deep.equal(expecteds);
  });

  it("retorna um carro ao cliente da categoria selecionada com a fatura da transacao", async () => {
    const carValid = mocks.validCar;
    const carCategory = {
      ...mocks.validCategory,
      price: 37.6,
      carsId: [carValid.id],
    };
    const validCustumer = mocks.validCustumer;
    validCustumer.age = 20;
    const dueDate = "11 de novembro de 2020";

    const numberOfDays = 5;
    const today = new Date(2020, 10, 6);
    sandobox.useFakeTimers(today.getTime());

    sandobox.stub(carServies.carRepository, carServies.carRepository.find.name ).resolves(carValid);
    const expectedsAmount = carServies.currencyFormat.format(206.8);
    const result = await carServies.rent(
      validCustumer,
      carCategory,
      numberOfDays
    );

    const expecteds2 = new Transaction({
      custumer: validCustumer,
      car: carValid,
      amout: expectedsAmount,
      numberofday: dueDate
    })
    expect(result).to.be.deep.equal(expecteds2)
  });
});
