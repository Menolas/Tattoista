const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const ArchivedClient = require('../models/ArchivedClient');
const controller = require('../controllers/clientsController');
const authRoleMiddleware = require('../middlewares/authRoleMiddleware');

// Getting all
router.get('/all', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.getClients);

// get archived clients
router.get('/archive', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.getArchivedClients);

// Getting one
router.get('/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getClient, controller.getClient);

// Creating one
router.post('/', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.addClient);

// update client tattoo gallery
router.post('/updateGallery/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getClient, controller.updateClientGallery);

// delete picture from client gallery
router.delete('/updateGallery/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getClient, controller.deleteClientGalleryPicture);

// delete client
router.delete('/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getClient, controller.deleteClient);

// delete archived client
router.delete('/archive/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getArchivedClient, controller.deleteArchivedClient);

// edit client
router.post('/edit/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getClient, controller.editClient);

// toggle favourite
router.patch('/favourite/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]),getClient, controller.toggleFavourite);

// archive client
router.get('/archive/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getClient, controller.archiveClient);

// reactivate client from archive
router.get('/reactivate/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getArchivedClient, controller.reactivateClient);

async function getClient(req, res, next) {
  let client;
  try {
    client = await Client.findById(req.params.id);
    if (client == null) {
      return res.status(404).json({ message: 'Cannot find client' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.client = client;
  next();
}

async function getArchivedClient(req, res, next) {
  let client;
  try {
    client = await ArchivedClient.findById(req.params.id);
    if (client == null) {
      return res.status(404).json({ message: 'Cannot find client' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.client = client;
  next();
}

module.exports = router;
