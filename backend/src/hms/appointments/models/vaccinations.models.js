import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Vaccinations = sequelize.define(
    "Vaccinations",
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
        vaccine_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        vaccine_code: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        manufacturer: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        batch_number: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        date_given: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        next_due_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        doctor_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "doctors",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        site_of_injection: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        adverse_reactions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: "vaccinations",
        timestamps: true,
    }
);

export default Vaccinations;
