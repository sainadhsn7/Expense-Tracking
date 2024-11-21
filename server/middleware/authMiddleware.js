import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log('Authorization header missing');
        return res.status(401).json({ message: 'Authorization header missing, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log('Token not found in authorization header');
        return res.status(401).json({ message: 'Token not found, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        console.log('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Token is not valid, authorization denied' });
    }
};

export default authMiddleware;
