const { sequelize } = require("./db");

sequelize.sync({ alter: true, logging: console.log }).then(() => {
    console.log(" Tables creation process done!");
    process.exit(0);
}).catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});

