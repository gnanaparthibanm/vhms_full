import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Discount = sequelize.define("Discount", {
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
    type: DataTypes.ENUM('percentage', 'amount'),
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: "discounts",
  timestamps: true,
});

export default Discount;
