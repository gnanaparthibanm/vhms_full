import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const TaxRate = sequelize.define("TaxRate", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  tableName: "tax_rates",
  timestamps: true,
});

export default TaxRate;
