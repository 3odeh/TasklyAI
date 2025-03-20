const { db } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userRef = db.collection("users").doc();
    await userRef.set({
        userId: userRef.id,
        name,
        email,
        password: hashedPassword,
        createdAt: new Date()
    });

    res.status(201).json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) return res.status(400).json({ message: "User not found" });

    const user = snapshot.docs[0].data();
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
};
