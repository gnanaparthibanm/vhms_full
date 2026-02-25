import { sequelize } from "../../../db/index.js";
import { DataTypes } from "sequelize";
import Client from "../../clients/models/clients.models.js";
import Pet from "../../clients/models/pet.models.js";

export const RecordType = sequelize.define(
    "RecordType",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "general"
        },
        templateRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: "Active",
            allowNull: false,
        },

        // Audit fields
        created_by: { type: DataTypes.UUID, allowNull: true },
        updated_by: { type: DataTypes.UUID, allowNull: true },
        deleted_by: { type: DataTypes.UUID, allowNull: true },

        created_by_name: { type: DataTypes.STRING, allowNull: true },
        updated_by_name: { type: DataTypes.STRING, allowNull: true },
        deleted_by_name: { type: DataTypes.STRING, allowNull: true },

        created_by_email: { type: DataTypes.STRING, allowNull: true },
        updated_by_email: { type: DataTypes.STRING, allowNull: true },
        deleted_by_email: { type: DataTypes.STRING, allowNull: true },
    },
    {
        tableName: "record_types",
        timestamps: true,
    }
);

export const RecordTemplate = sequelize.define(
    "RecordTemplate",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        record_type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
        fields: {
            // Store dynamic field definitions as an array of JSON objects
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },

        // Audit fields
        created_by: { type: DataTypes.UUID, allowNull: true },
        updated_by: { type: DataTypes.UUID, allowNull: true },
        deleted_by: { type: DataTypes.UUID, allowNull: true },

        created_by_name: { type: DataTypes.STRING, allowNull: true },
        updated_by_name: { type: DataTypes.STRING, allowNull: true },
        deleted_by_name: { type: DataTypes.STRING, allowNull: true },

        created_by_email: { type: DataTypes.STRING, allowNull: true },
        updated_by_email: { type: DataTypes.STRING, allowNull: true },
        deleted_by_email: { type: DataTypes.STRING, allowNull: true },
    },
    {
        tableName: "record_templates",
        timestamps: true,
    }
);

export const MedicalRecord = sequelize.define(
    "MedicalRecord",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        // It's common to link the record to both the specific pet and their owner/client
        client_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "clients",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
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
        template_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "record_templates",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        record_type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        diagnosis: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        field_values: {
            // Stores the key-value dictionary of the dynamic template fields
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: "Active",
            allowNull: false,
        },

        // Audit fields
        created_by: { type: DataTypes.UUID, allowNull: true },
        updated_by: { type: DataTypes.UUID, allowNull: true },
        deleted_by: { type: DataTypes.UUID, allowNull: true },

        created_by_name: { type: DataTypes.STRING, allowNull: true },
        updated_by_name: { type: DataTypes.STRING, allowNull: true },
        deleted_by_name: { type: DataTypes.STRING, allowNull: true },

        created_by_email: { type: DataTypes.STRING, allowNull: true },
        updated_by_email: { type: DataTypes.STRING, allowNull: true },
        deleted_by_email: { type: DataTypes.STRING, allowNull: true },
    },
    {
        tableName: "medical_records",
        timestamps: true,
    }
);

// Setup Associations
MedicalRecord.belongsTo(Client, { foreignKey: "client_id", as: "client" });
MedicalRecord.belongsTo(Pet, { foreignKey: "pet_id", as: "pet" });
MedicalRecord.belongsTo(RecordTemplate, { foreignKey: "template_id", as: "template" });
Client.hasMany(MedicalRecord, { foreignKey: "client_id", as: "medical_records" });
Pet.hasMany(MedicalRecord, { foreignKey: "pet_id", as: "medical_records" });
RecordTemplate.hasMany(MedicalRecord, { foreignKey: "template_id" });

export default { RecordType, RecordTemplate, MedicalRecord };
