const { db } = require('../utils/db_pgp');

const getStoreLayout = async (call, callback) => {
    try {
        const storeId = call.request.id;
        const layouts = await db.any('SELECT * FROM layout WHERE store_id = $1', [storeId]);

        callback(null, { layouts: layouts });
    } catch (error) {
        console.error("Error fetching store layout:", error);
        callback(error);
    }
};

const addLayout = async (call, callback) => {
    try {
        const layout = call.request.layout;
        const result = await db.one('INSERT INTO layout(pos_x, pos_y, row_span, col_span, type, store_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id', [layout.pos_x, layout.pos_y, layout.row_span, layout.col_span, layout.type, layout.store_id]);
        
        callback(null, { layout_id: result.id, status: "SUCCESS" });
    } catch (error) {
        console.error("Error adding layout:", error);
        callback(error);
    }
};

const updateLayout = async (call, callback) => {
    try {
        const layout = call.request.layout;
        await db.none('UPDATE layout SET pos_x=$1, pos_y=$2, row_span=$3, col_span=$4, type=$5, store_id=$6 WHERE id=$7', [layout.pos_x, layout.pos_y, layout.row_span, layout.col_span, layout.type, layout.store_id, layout.id]);
        
        callback(null, { status: "SUCCESS" });
    } catch (error) {
        console.error("Error updating layout:", error);
        callback(error);
    }
};

const deleteLayout = async (call, callback) => {
    try {
        const layoutId = call.request.layout_id;
        await db.none('DELETE FROM layout WHERE id=$1', [layoutId]);
        
        callback(null, { status: "SUCCESS" });
    } catch (error) {
        console.error("Error deleting layout:", error);
        callback(error);
    }
};

module.exports = {
    getStoreLayout,
    addLayout,
    updateLayout,
    deleteLayout
};
