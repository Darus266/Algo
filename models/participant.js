const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Le nom complet est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  phone: {
    type: String,
    trim: true,
    sparse: true
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    required: [true, 'Le statut est requis'],
    enum: ['Étudiant', 'Développeur', 'Chef de projet', 'Entrepreneur', 'Enseignant', 'Autre']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  attendance: {
    checkedIn: {
      type: Boolean,
      default: false
    },
    checkinTime: Date,
    badgeNumber: String
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des recherches
participantSchema.index({ email: 1 });
participantSchema.index({ registrationDate: -1 });

module.exports = mongoose.model('Participant', participantSchema);