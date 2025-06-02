exports.getLoginPage = (req, res) => {
    res.render('auth/login', { title: 'Login' , pageJS: 'login'});
};

exports.getRegisterPage = (req, res) => {
    res.render('auth/register', { title: 'Register' });
};

exports.getProfilePage = (req, res) => {
    res.render('user/profile', {
        title: 'Your Profile',
    });
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/profile');
        }
        res.redirect('/login');
    });
};

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Show login page (GET route - assumed already implemented)
exports.getLoginPage = (req, res) => {
    res.render('auth/login', { title: 'Login' ,pageJS: 'login'});
};

// Show register page (GET route - assumed already implemented)
exports.getRegisterPage = (req, res) => {
    res.render('auth/register', { title: 'Register' });
};

// Handle registration

exports.register = async (req, res, next) => {
    const {
        naam,
        adres,
        postcode,
        woonplaats,
        land,
        telefoonnummer,
        email,
        password,
        confirmPassword
    } = req.body;

    // Basic validation
    if (password !== confirmPassword) {
        return res.render('auth/register', {
            error_msg: 'Passwords do not match',
            naam, adres, postcode, woonplaats, land, telefoonnummer, email
        });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.render('auth/register', {
                error_msg: 'Email already registered',
                naam, adres, postcode, woonplaats, land, telefoonnummer, email
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user = new User({
            naam,
            adres,
            postcode,
            woonplaats,
            land,
            telefoonnummer,
            email,
            password: hashedPassword
        });

        await user.save();
        res.redirect('/auth/login');
    } catch (err) {
        next(err);
    }
};


// Handle login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth/login', { error_msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/login', { error_msg: 'Invalid credentials' });
        }

        // Set user session
        req.session.user = user;
        req.session.isAuth = true;
        req.session.isAdmin = user.role === 'admin';

        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

// Handle logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

// Get profile page (GET)
exports.getProfilePage = (req, res) => {
    res.render('auth/profile', { title: 'Your Profile', user: req.session.user });
};

// Handle profile update
exports.updateProfile = async (req, res, next) => {
    const { name, email } = req.body;

    try {
        const user = await User.findById(req.session.user._id);
        if (!user) return res.redirect('/login');

        user.name = name;
        user.email = email;

        await user.save();
        req.session.user = user; // Update session
        res.redirect('/profile');
    } catch (err) {
        next(err);
    }
};
