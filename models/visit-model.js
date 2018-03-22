const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitSchema = new Schema({
    temperatureDeg: {
      type: Number,
      required: true,
      min: 90,
      max: 110.9
    },
    temperatureScale:{
      type: String,
      required: true,
      enum: ["C", "F"]
    },
    heightNumOne: {
      type: Number,
      required: true,
      max: 10,
    },
    heightScaleOne:{
      type: String,
      required: true,
      enum: ["ft", "m", "''"]
    },
    heightNumTwo:{
      type: Number,
      required: true,
      min: 0,
      max: 36
    },
    heightScaleTwo:{
      type: String,
      required: true,
    
      enum: ["in", "cm", "'"]
    },
    weightNum: {
      type: Number,
      required: true,
      min:0,
      max:999
    },
    weightScale:{
      type: String,
      required: true,
      enum: ['lb', 'kg', 'lbs', 'kgs']
    },
    blood_pressure:{
      type: String,
      required: true
    },
    chief_complaint: {
      type: String,
      required: true
    },
    assessment: {
      type: String,
      required: true,
    },
    treatment:{
      type: String,
      required: true
    },
    patient_id:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    doctor_id:{
      type: Schema.Types.ObjectId,
      required: true
    }                
  },
    {
      timestamps: true
    }
);

const Visit = mongoose.model('Visit', VisitSchema);

module.exports = Visit;



