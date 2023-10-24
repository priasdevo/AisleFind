// entity/Store.js

const StoreSchema = {
  name: "Store",
  target: "Store",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    title: {
      type: "varchar"
    },
    description: {
      type: "varchar"
    },
    size_x: {
      type: "int"
    },
    size_y: {
      type: "int"
    },
    owner_id: {
      type: "varchar" 
    }
  }
};

module.exports = StoreSchema;
