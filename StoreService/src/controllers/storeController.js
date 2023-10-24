const { db } = require('../utils/db_pgp');

const getStoresList = async (_, callback) => {
    try {
        const stores = await db.any('SELECT * FROM store');
        console.log("Test stores before return stores : ", stores);
        callback(null, { stores: stores });
    } catch (error) {
        console.log("error : ", error);
        callback(error);
    }
};

const createStore = async (call, callback) => {
    try {
        const store = call.request.store;
        const result = await db.one('INSERT INTO store(title, description, size_x, size_y, owner_id) VALUES($1, $2, $3, $4, $5) RETURNING id', [store.title, store.description, store.size_x, store.size_y, store.owner_id]);
        callback(null, { id: result.id });
    } catch (error) {
        console.log("error : ", error);
        callback(error);
    }
};

const updateStore = async (call, callback) => {
    try {
        const store = call.request.store;
        await db.none('UPDATE store SET title=$1, description=$2, size_x=$3, size_y=$4, owner_id=$5 WHERE id=$6', [store.title, store.description, store.size_x, store.size_y, store.owner_id, store.id]);
        callback(null, { status: "SUCCESS" });
    } catch (error) {
        console.log("error : ", error);
        callback(error);
    }
};

const deleteStore = async (call, callback) => {
    try {
        const id = call.request.id;
        await db.none('DELETE FROM store WHERE id=$1', [id]);
        callback(null, { status: "SUCCESS" });
    } catch (error) {
        console.log("error : ", error);
        callback(error);
    }
};

const getStore = async (call, callback) => {
    try {
        const id = call.request.id;
        const store = await db.one('SELECT * FROM store WHERE id=$1', [id]);
        callback(null, { store: store });
    } catch (error) {
        console.log("error : ", error);
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
