import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Prescriptions = sequelize.define(
    "Prescriptions",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        pet_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "pets",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        diagnosis_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "diagnosis",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        appointment_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "appointments",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        prescription_no: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        prescription_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Dispensed', 'Partially_Dispensed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
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
    },
    {
        tableName: "prescriptions",
        timestamps: true,
    }
);

export default Prescriptions;
