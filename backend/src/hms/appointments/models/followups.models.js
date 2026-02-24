import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const FollowUps = sequelize.define(
    "FollowUps",
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
        next_visit_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled', 'Missed'),
            allowNull: false,
            defaultValue: 'Scheduled',
        },
        reminder_sent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
        tableName: "follow_ups",
        timestamps: true,
    }
);

export default FollowUps;
