import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const GroomingServices = sequelize.define(
    "GroomingServices",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        grooming_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "grooming",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        service_type: {
            type: DataTypes.ENUM(
                'Bath', 
                'Haircut', 
                'Nail_Trimming', 
                'Ear_Cleaning', 
                'Teeth_Brushing', 
                'Anal_Gland_Expression',
                'Flea_Treatment',
                'De_Shedding',
                'Full_Grooming_Package',
                'Other'
            ),
            allowNull: false,
        },
        service_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        status: {
            type: DataTypes.ENUM('Pending', 'In_Progress', 'Completed', 'Skipped'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        products_used: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Array of products used (shampoo, conditioner, etc.)'
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
    },
    {
        tableName: "grooming_services",
        timestamps: true,
    }
);

export default GroomingServices;
