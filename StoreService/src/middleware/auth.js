const grpc = require("@grpc/grpc-js");
const axios = require("axios");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const service_URL = process.env.USER_SERVICE_URL; 

async function verifyToken(token) {
    // Call your auth service to verify the token
    const response = await axios.get(`${service_URL}/auth/user`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data; // Return the response data which might contain user details
}

async function authenticateAndAuthorize(call, needOwnerRole = false) {
    const metadata = call.metadata.getMap();
    const bearerToken = metadata['authorization'];
    const token = bearerToken && bearerToken.split(' ')[1]; // Extract the token part

    // Make sure token exists
    if (!token || token === "null") {
        throw { code: grpc.status.UNAUTHENTICATED, message: "No token provided." };
    }

    // Verify the token and check for the owner role if needed
    const userData = await verifyToken(token);
    if (needOwnerRole && userData.role !== 'owner') {
        throw { code: grpc.status.PERMISSION_DENIED, message: "Must be owner role" };
    }

    return userData;
}

function protect(handler) {
    return async (call, callback) => {
        try {
            await authenticateAndAuthorize(call);
            handler(call, callback);
        } catch (error) {
            callback(error);
        }
    };
}

function protectOwnerRole(handler) {
    return async (call, callback) => {
        try {
            const userData = await authenticateAndAuthorize(call, true);
            call.user = userData; // Attach user data to the call object
            handler(call, callback);
        } catch (error) {
            callback(error);
        }
    };
}

module.exports = { protect, protectOwnerRole };
