const mysql = require('mysql2');
const Sequelize = require('sequelize');

async function Initialize()
{
    //DATABASE HERE ->
    var dialect = process.env.DIALECT;

    //Use a different database depending on dialect for easy local use
    if(dialect === "mysql") {
        sequelize = new Sequelize(process.env.DATABASE_URL);
    }
    else if(dialect === "sqlite") {
        sequelize = new Sequelize('database', null, null, {
        host: 'localhost',
        dialect: 'sqlite',
        
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        
        // SQLite only
        storage: './Libraries/Storage/LocalDatabase.db'
        ,
        
        // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
        operatorsAliases: false
        });
    }

    AllowedRoles = sequelize.define('allowedRoles', {
    roleId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    }
    });
}

async function Authenticate()
{
    sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    AllowedRoles.sync();
}

exports.Initialize = Initialize;
exports.Authenticate = Authenticate;