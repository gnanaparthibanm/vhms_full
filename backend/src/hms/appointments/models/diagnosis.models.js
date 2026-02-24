import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Diagnosis = sequelize.define(
    "Diagnosis",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        addmission_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "admissions",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        diagnosis_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        severity: {
            type: DataTypes.ENUM('Mild', 'Moderate', 'Severe'),
            allowNull: false,
        },
        remarks: {
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
        tableName: "diagnosis",
        timestamps: true,
    }
);

export default Diagnosis;