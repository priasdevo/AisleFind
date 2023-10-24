const { db } = require('../utils/db_pgp');

const getStoresList = async (_, callback) => {
    try {
      const stores = await db.any('SELECT * FROM stores');
        console.log("Test stores before return stores : ", stores);

        callback(null, { stores: stores });
    } catch (error) {
        console.log("error : ", error);
        callback(error);
    }
};

// ... [other methods]

module.exports = {
    getStoresList,
    // ... [other exports]
};
