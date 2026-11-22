const userModel = require('../Models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        const existingUser = await userModel.findOne({ name });

        if (!existingUser) {
            return res.status(401).json({ message: "No such user" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Passwords don't match" });
        }

        const token = jwt.sign(
            {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: false,
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

const checkToken = async (req, res) => {
    try {
        let token = req.cookies?.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ success: false, message: "No token found" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ success: true, message: "Token valid", user: decoded, token });
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password, role, restaurantName } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        }

        const existingUser = await userModel.findOne({ 
            $or: [{ email: email.toLowerCase() }, { name }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: existingUser.email === email.toLowerCase() 
                    ? "An account with this email already exists" 
                    : "An account with this username already exists" 
            });
        }

        const photo = req.file?.filename || null;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password: hashedPassword,
            role: role || "Customer",
            restaurantName: role === "RestaurantAdmin" ? restaurantName : undefined,
            photo 
        });

        await newUser.save();

        res.status(201).json({ success: true, message: `User registered successfully: ${name}` });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ success: false, message: err.message || "Internal server error" });
    }
};

module.exports = { login, logout, register, checkToken };
