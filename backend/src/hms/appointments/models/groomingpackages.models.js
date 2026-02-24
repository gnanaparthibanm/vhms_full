import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const GroomingPackages = sequelize.define(
    "GroomingPackages",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        package_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        package_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        pet_size: {
            type: DataTypes.ENUM('Small', 'Medium', 'Large', 'Extra_Large', 'All'),
            allowNull: false,
            defaultValue: 'All',
        },
        services_included: {
            type: DataTypes.JSON,
            allowNull: false,
            comment: 'Array of service types included in package'
        },
        base_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        estimated_duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Estimated duration in minutes'
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
        tableName: "grooming_packages",
        timestamps: true,
    }
);

export default GroomingPackages;
