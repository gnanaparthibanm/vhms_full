import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const PaymentMethod = sequelize.define("PaymentMethod", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('cash', 'card', 'transfer', 'cheque', 'digital', 'mobile_money', 'other'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_by: { type: DataTypes.UUID, allowNull: true },
  created_by_name: { type: DataTypes.STRING(255), allowNull: true },
  created_by_email: { type: DataTypes.STRING(255), allowNull: true },
  updated_by: { type: DataTypes.UUID, allowNull: true },
  updated_by_name: { type: DataTypes.STRING(255), allowNull: true },
  updated_by_email: { type: DataTypes.STRING(255), allowNull: true },
  deleted_by: { type: DataTypes.UUID, allowNull: true },
  deleted_by_name: { type: DataTypes.STRING(255), allowNull: true },
  deleted_by_email: { type: DataTypes.STRING(255), allowNull: true },
}, {
  tableName: "payment_methods",
  timestamps: true,
});

export default PaymentMethod;
