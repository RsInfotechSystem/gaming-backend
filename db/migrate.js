const { sequelize } = require("./db");

sequelize.sync({ force: false }).then(() => {
    console.log("yes re-sync done!");
    process.exit(0);
}).catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
