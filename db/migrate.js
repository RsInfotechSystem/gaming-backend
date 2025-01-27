const { sequelize } = require("./db");

sequelize.sync({ alter: true }).then(() => {
    console.log("yes re-sync done!");
    process.exit(0);
}).catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
