const Router = require("express");
const router = new Router();
const controller = require("../controllers/usersController");
const roleMiddleware = require('../middlewares/roleMiddleware');
const User = require("../models/User");

//getting roles
router.get('/roles', controller.getRoles);

//Getting users
router.get('/', roleMiddleware(["SUPERADMIN"]), controller.getUsers);
//router.get('/users', authMiddleware, authController.getUsers)

// delete user
router.delete('/:id', getUser, controller.deleteUser);

//update user
router.post('/edit/:id', getUser, controller.updateUser);

//creating user

router.post('/', controller.addUser);

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;
