const { db } = require('../utils/db_pgp');
const grpc = require("@grpc/grpc-js");
const { sendMessage } = require('../utils/logService');

const getStoreLayout = async (call, callback) => {
    try {
        const storeId = call.request.id;
        const layouts = await db.any('SELECT * FROM layout WHERE store_id = $1', [storeId]);
        sendMessage('Log', "Get store layout", { storeId });
        callback(null, { layouts: layouts });
    } catch (error) {
        console.error("Error fetching store layout:", error);
        sendMessage('Log', "Get store layout", { storeId }, error);
        callback(error);
    }
};

const checkStoreOwnership = async (storeId, userId) => {
    // Check if the store exists and if the owner_id matches the user ID
    const store = await db.oneOrNone('SELECT owner_id FROM store WHERE id = $1', [storeId]);
    if (!store || store.owner_id !== userId) {
        throw new Error('User does not have permission to modify this store.');
    }
};

const addLayout = async (call, callback) => {
    try {
        const layout = call.request.layout;
        const userId = call.user.id;

        // Check if the user owns the store before adding layout
        await checkStoreOwnership(layout.store_id, userId);

        const result = await db.one(
            'INSERT INTO layout(pos_x, pos_y, row_span, col_span, type, store_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            [layout.pos_x, layout.pos_y, layout.row_span, layout.col_span, layout.type, layout.store_id]
        );
        sendMessage('Log', "Add store layout", { result });
        callback(null, { layout_id: result.id, status: "SUCCESS" });
    } catch (error) {
        sendMessage('Log', "Add store layout", { resultID, error });
        console.error("Error adding layout:", error);
        callback({ code: grpc.status.PERMISSION_DENIED, message: error.message });
    }
};

const updateLayout = async (call, callback) => {
    try {
        const layout = call.request.layout;
        const userId = call.user.id;

        // Check if the user owns the store before updating layout
        await checkStoreOwnership(layout.store_id, userId);

        await db.none(
            'UPDATE layout SET pos_x=$1, pos_y=$2, row_span=$3, col_span=$4, type=$5 WHERE id=$6 AND store_id=$7',
            [layout.pos_x, layout.pos_y, layout.row_span, layout.col_span, layout.type, layout.id, layout.store_id]
        );
        const layoutId = layout.id;
        sendMessage('Log', "Update store layout", { layoutId });
        callback(null, { status: "SUCCESS" });
    } catch (error) {
        console.error("Error updating layout:", error);
        sendMessage('Log', "Update store layout", { layoutId, error });
        callback({ code: grpc.status.PERMISSION_DENIED, message: error.message });
    }
};

const deleteLayout = async (call, callback) => {
    try {
        const layoutId = call.request.layout_id;
        const userId = call.user.id;

        // To check ownership, we need the store_id which the layout belongs to
        const layout = await db.oneOrNone('SELECT store_id FROM layout WHERE id = $1', [layoutId]);
        if (!layout) {
            throw new Error('Layout does not exist.');
        }

        // Check if the user owns the store before deleting layout
        await checkStoreOwnership(layout.store_id, userId);

        await db.none('DELETE FROM layout WHERE id=$1', [layoutId]);
        sendMessage('Log', "Delete store layout", { layoutId });
        callback(null, { status: "SUCCESS" });
    } catch (error) {
        console.error("Error deleting layout:", error);
        sendMessage('Log', "Delete store layout", { layoutId, error });
        callback({ code: grpc.status.PERMISSION_DENIED, message: error.message });
    }
};


module.exports = {
    getStoreLayout,
    addLayout,
    updateLayout,
    deleteLayout
};
