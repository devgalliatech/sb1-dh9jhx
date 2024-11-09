require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const contributionRoutes = require('./routes/contribution.routes');
const commentRoutes = require('./routes/comment.routes');
const notificationRoutes = require('./routes/notification.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const tiktokRoutes = require('./routes/tiktok.routes');

const app = express();
const port = process.env.PORT || 3000;

// Connexion à la base de données
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API GalliaTech opérationnelle' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tiktok', tiktokRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(port, () => {
  console.log(`🚀 Serveur API démarré sur le port ${port}`);
});