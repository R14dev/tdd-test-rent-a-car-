const Base = require("./base/Base");
class car extends Base {
  constructor({ id, name, releaseYear, available, gasAvailable }) {
    super({ id, name });
    (this.releaseYear = releaseYear),
    (this.available = available),
    (this.gasAvailable = gasAvailable);
  }
}
module.exports = car;
