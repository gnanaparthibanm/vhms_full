import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const BillableItem = sequelize.define("BillableItem", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.ENUM('Service', 'Product', 'Medication'),
        allowNull: false,
        defaultValue: 'Service',
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
    },
    profit_margin: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    initial_stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    current_stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active',
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    duration: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    stock_tracking: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    reorder_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    tags: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    tax_rate: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    manufacturer: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    barcode: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    deleted_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    created_by_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updated_by_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    deleted_by_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_by_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updated_by_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    deleted_by_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: "billable_items",
    timestamps: true,
});

export default BillableItem;
