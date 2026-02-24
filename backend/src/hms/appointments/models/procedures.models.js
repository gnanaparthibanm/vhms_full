import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Procedures = sequelize.define(
    "Procedures",
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
            allowNull: false,
            references: {
                model: "appointments",
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
        procedure_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        procedure_code: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        scheduled_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        performed_date: {
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
        status: {
            type: DataTypes.ENUM('Scheduled', 'In_Progress', 'Completed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Scheduled',
        },
        cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        duration_minutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        complications: {
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
        tableName: "procedures",
        timestamps: true,
    }
);

export default Procedures;
