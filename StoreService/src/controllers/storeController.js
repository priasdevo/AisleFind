const { db } = require('../utils/db_pgp');
const grpc = require("@grpc/grpc-js");
const { sendMessage } = require('../utils/logService');

const getStore = async (call, callback) => {
    try {
        const id = call.request.id;
        const store = await db.one('SELECT * FROM store WHERE id=$1', [id]);
        console.log(call.user.role);
        if(call.user.role == "owner"){
            if(store.owner_id != call.user.id){
                callback({
                    code: grpc.status.PERMISSION_DENIED,
                    message: 'You do not have permission to access this store.',
                });
            }
            else{
                sendMessage('Log', "Get store", { id });
                callback(null, { store: store });
            }
        }
        else{
            sendMessage('Log', "Get store", { id });
            callback(null, { store: store });
        }
    } catch (error) {
        console.log("error : ", error);
        sendMessage('Log', "error while getting store", { id, error });
        callback(null, { error: error });
    }
};

const getStoresList = async (call, callback) => {
    try {
        let stores = [];
        if(call.user.role == "owner"){
            stores = await db.any('SELECT * FROM store WHERE owner_id=$1', [call.user.id]);
        }
        else{
            stores = await db.any('SELECT * FROM store');    
        }
        sendMessage('Log', "Get stores list");
        callback(null, { stores: stores });
    } catch (error) {
        sendMessage('Log', "error while getting stores list", { error });
        console.log("error : ", error);
        callback(error);
    }
};

const createStore = async (call, callback) => {
    try {
        const store = call.request.store;
        store.owner_id = call.user.id;
        const result = await db.one('INSERT INTO store(title, description, size_x, size_y, owner_id) VALUES($1, $2, $3, $4, $5) RETURNING id', [store.title, store.description, store.size_x, store.size_y, store.owner_id]);
        sendMessage('Log', "Create store", { result });
        callback(null, { id: result.id });
    } catch (error) {
        console.log("error : ", error);
        sendMessage('Log', "error while creating store", { error });
        callback(error);
    }
};

const updateStore = async (call, callback) => {
    try {
        const store = call.request.store;
        const owner_id = call.user.id; // This should be set by the protectOwnerRole middleware
        
        // Check if the store belongs to the user
        const storeData = await db.oneOrNone('SELECT owner_id FROM store WHERE id=$1', [store.id]);
        if (!storeData || storeData.owner_id !== owner_id) {
            callback({
                code: grpc.status.PERMISSION_DENIED,
                message: 'You do not have permission to update this store.',
            });
            return;
        }
        
        await db.none('UPDATE store SET title=$1, description=$2, size_x=$3, size_y=$4 WHERE id=$5 AND owner_id=$6', [store.title, store.description, store.size_x, store.size_y, store.id, owner_id]);
        const storeId = store.id;
        sendMessage('Log', "Update store", { storeId });
        callback(null, { status: "SUCCESS" });
    } catch (error) {
        console.log("error : ", error);
        sendMessage('Log', "error while updating store", { error });
        callback(error);
    }
};

const deleteStore = async (call, callback) => {
    try {
        const id = call.request.id;
        const owner_id = call.user.id; // This should be set by the protectOwnerRole middleware

        // Check if the store belongs to the user
        const storeData = await db.oneOrNone('SELECT owner_id FROM store WHERE id=$1', [id]);
        if (!storeData || storeData.owner_id !== owner_id) {
            callback({
                code: grpc.status.PERMISSION_DENIED,
                message: 'You do not have permission to delete this store.',
            });
            return;
        }

        await db.none('DELETE FROM store WHERE id=$1 AND owner_id=$2', [id, owner_id]);
        sendMessage('Log', "Delete store", { id });
        callback(null, { status: "SUCCESS" });
    } catch (error) {
        console.log("error : ", error);
        sendMessage('Log', "error while deleting store", { error });
        callback(error);
    }
};





module.exports = {
    getStoresList,
    createStore,
    updateStore,
    deleteStore,
    getStore,
};
