import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const PrescriptionItems = sequelize.define(
    "PrescriptionItems",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        prescription_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "prescriptions",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "products",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 },
        },
        dispensed_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 },
        },
        dosage: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        frequency: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        duration: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        tableName: "prescription_items",
        timestamps: true,
    }
);

export default PrescriptionItems;
