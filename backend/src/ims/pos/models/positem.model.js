import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const POSSaleItem = sequelize.define("POSSaleItem", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    sale_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'pos_sales',
            key: 'id',
        },
    },
    billable_item_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    item_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    item_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
    },
    tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: "pos_sale_items",
    timestamps: true,
});

export default POSSaleItem;
