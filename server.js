require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Autorise les requêtes depuis votre fichier HTML
app.use(express.json()); // Pour analyser les données JSON envoyées

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Définition du Schéma Participant (Modèle de données)
const participantSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    status: { type: String, required: true }
}, { timestamps: true }); // Ajoute createdAt et updatedAt automatiquement

const Participant = mongoose.model('Participant', participantSchema);

// --- ROUTES API ---

// 1. Récupérer tous les participants (GET)
app.get('/api/participants', async (req, res) => {
    try {
        // Récupère tous les participants, triés du plus récent au plus ancien
        const participants = await Participant.find().sort({ createdAt: -1 });
        res.json({ success: true, data: participants });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. Créer un nouveau participant (POST)
app.post('/api/participants', async (req, res) => {
    try {
        const { fullname, email, phone, company, status } = req.body;

        // Validation simple
        if (!fullname || !email || !status) {
            return res.status(400).json({ success: false, error: 'Champs obligatoires manquants' });
        }

        const newParticipant = new Participant({
            fullname,
            email,
            phone,
            company,
            status
        });

        const savedParticipant = await newParticipant.save();
        res.status(201).json({ success: true, data: savedParticipant });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. Supprimer un participant (DELETE)
app.delete('/api/participants/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedParticipant = await Participant.findByIdAndDelete(id);

        if (!deletedParticipant) {
            return res.status(404).json({ success: false, error: 'Participant non trouvé' });
        }

        res.json({ success: true, message: 'Participant supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});