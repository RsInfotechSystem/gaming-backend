
const Stock = (sequelize, DataTypes) => {
    return sequelize.define('Stock', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        locationId: {
            type: DataTypes.UUID,
            references: {
                model: 'Location', // 'Location' should match the name of the Location model
                key: 'id',
            },
        },
        blockId: {
            type: DataTypes.UUID,
            references: {
                model: 'Block', // 'Block' should match the name of the Location model
                key: 'id',
            },
        },
        categoryId: {
            type: DataTypes.UUID,
            references: {
                model: 'Category', // 'Category' should match the name of the Location model
                key: 'id',
            },
        },
        brandId: {
            type: DataTypes.UUID,
            references: {
                model: 'Brand', // 'Brand' should match the name of the Location model
                key: 'id',
            },
        },
        conditionType: {
            type: DataTypes.ENUM('new', 'refurbished'),
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'new'
        },
        itemCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        serialNo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        remainingQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        logs: {
            type: DataTypes.JSONB, // Sequelize does not have a direct array type, using JSONB to store arrays
            allowNull: true,
            defaultValue: []
        },
        stockInBy: {
            type: DataTypes.UUID, // Assuming you're using UUIDs for object IDs
            allowNull: false,
            references: {
                model: 'User', // Name of the related model
                key: 'id'
            }
        },
        assignedTo: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        materialAdded: {
            type: DataTypes.ARRAY(DataTypes.UUID), // For an array of references
            allowNull: true,
            defaultValue: []
        },
        stockStatus: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'new'
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        assignedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        soldDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        addedIn: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        isAdded: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'Stock',
        timestamps: true,
    })
};


module.exports = Stock;