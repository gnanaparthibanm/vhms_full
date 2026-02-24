import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Grooming = sequelize.define(
    "Grooming",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
        groomer_id: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Staff member assigned for grooming'
        },
        grooming_no: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.ENUM('Scheduled', 'In_Progress', 'Completed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Scheduled',
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        total_cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        special_instructions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        pet_behavior: {
            type: DataTypes.ENUM('Calm', 'Anxious', 'Aggressive', 'Cooperative'),
            allowNull: true,
        },
        health_concerns: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Any health issues noticed during grooming'
        },
        before_photos: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Array of photo URLs before grooming'
        },
        after_photos: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Array of photo URLs after grooming'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        recommended_by_doctor: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'True if grooming was recommended during consultation'
        },
        consultation_id: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Reference to consultation appointment if recommended'
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
        tableName: "grooming",
        timestamps: true,
    }
);

export default Grooming;
