const LayoutSchema = {
    name: "Layout",
    target: "Layout",
    columns: {
      id: {
        primary: true,
        type: "int",
        generated: true
      },
      pos_x: {
        type: "int"
      },
      pos_y: {
        type: "int"
      },
      row_span: {
        type: "int"
      },
      col_span: {
        type: "int"
      },
      type: {
        type: "enum",
        enum: ["UNKNOWN", "SHELF", "CASHIER", "DOOR"]  // Replace with your actual LAYOUT_TYPE values
      },
      store_id: {
        type: "int"
      }
    }
  };
  
  module.exports = LayoutSchema;
  