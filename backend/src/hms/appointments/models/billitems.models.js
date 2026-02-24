import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const BillItems = sequelize.define(
    "BillItems",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        bill_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "bills",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        item_type: {
            type: DataTypes.ENUM('Consultation', 'Medicine', 'Lab', 'Procedure', 'Vaccination', 'Treatment', 'Grooming', 'Other'),
            allowNull: false,
        },
        item_id: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Reference ID to the actual item (prescription_id, lab_test_id, procedure_id, etc.)'
        },
        item_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        item_code: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
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
            defaultValue: 0.00,
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        tax_percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        tax_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        is_taxable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'True for products/items with GST, False for services'
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        tableName: "bill_items",
        timestamps: true,
    }
);

export default BillItems;
