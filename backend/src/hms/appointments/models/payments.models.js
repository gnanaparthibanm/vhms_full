import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Payments = sequelize.define(
    "Payments",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        payment_no: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
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
        payment_mode: {
            type: DataTypes.ENUM('Cash', 'UPI', 'Card', 'Net_Banking', 'Cheque', 'Other'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        transaction_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        payment_reference: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        paid_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
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
        tableName: "payments",
        timestamps: true,
    }
);

export default Payments;
