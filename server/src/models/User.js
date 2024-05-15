module.exports = (sequelize, DataTypes) => {
    return sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
            unique:true
        }, 
        password: {
            type: DataTypes.STRING,
        }
    });
}
