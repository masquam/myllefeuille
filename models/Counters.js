var mongoose = require('mongoose');

module.exports = mongoose.model('Counters', new mongoose.Schema({
_id: { type: String, required: true },
sequence: { type: Number, required: true }
},{
versionKey: false
}
));
