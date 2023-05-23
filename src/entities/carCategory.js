const Base = require("./base/Base");
class carCategory extends Base {
  constructor({ id, name, carsId, price }) {
    super({ id, name });
    this.carsId = carsId, 
    this.price = price;
  }
}

module.exports = carCategory;
