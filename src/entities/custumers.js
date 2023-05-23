const Base = require('./base/Base')
class custumer extends Base{
    constructor ({id,name,age}){
        super({id,name})
        this.age = age
    }
}   
module.exports = custumer