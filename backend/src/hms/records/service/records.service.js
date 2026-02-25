import { sequelize } from "../../../db/index.js";
import { RecordType, RecordTemplate, MedicalRecord } from "../models/records.models.js";
import { Op } from "sequelize";
import Client from "../../clients/models/clients.models.js";
import Pet from "../../clients/models/pet.models.js";

// ======================= RECORD TYPES =======================

export const getAllRecordTypes = async (query) => {
    let whereClause = {};

    if (query.name) {
        whereClause.name = {
            [Op.iLike]: `%${query.name}%`,
        };
    }

    if (query.is_active !== undefined) {
        whereClause.is_active = query.is_active === 'true';
    }

    const { count, rows } = await RecordType.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
    });

    return { total: count, data: rows };
};

export const getRecordTypeById = async (id) => {
    const recordType = await RecordType.findByPk(id);
    if (!recordType) {
        throw new Error("Record Type not found");
    }
    return recordType;
};

export const createRecordType = async (typeData) => {
    const recordType = await RecordType.create(typeData);
    return recordType;
};

export const updateRecordType = async (id, updateData) => {
    const recordType = await RecordType.findByPk(id);
    if (!recordType) {
        throw new Error("Record Type not found");
    }
    if (recordType.is_default) {
        throw new Error("Cannot update a system default record type");
    }
    // Prevent user from manually maliciously setting is_default to false
    if (updateData.is_default !== undefined) {
        delete updateData.is_default;
    }
    await recordType.update(updateData);
    return recordType;
};

export const deleteRecordType = async (id) => {
    const recordType = await RecordType.findByPk(id);
    if (!recordType) {
        throw new Error("Record Type not found");
    }
    if (recordType.is_default) {
        throw new Error("Cannot delete a system default record type");
    }
    await recordType.destroy();
    return { id };
};

// ======================= RECORD TEMPLATES =======================

export const getAllTemplates = async (query) => {
    let whereClause = {};

    if (query.record_type) {
        whereClause.record_type = {
            [Op.iLike]: `%${query.record_type}%`,
        };
    }

    if (query.is_active !== undefined) {
        whereClause.is_active = query.is_active === 'true';
    }

    const { count, rows } = await RecordTemplate.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
    });

    return { total: count, data: rows };
};

export const getTemplateById = async (id) => {
    const template = await RecordTemplate.findByPk(id);
    if (!template) {
        throw new Error("Template not found");
    }
    return template;
};

export const createTemplate = async (templateData) => {
    const template = await RecordTemplate.create(templateData);
    return template;
};

export const updateTemplate = async (id, updateData) => {
    const template = await RecordTemplate.findByPk(id);
    if (!template) {
        throw new Error("Template not found");
    }
    if (template.is_default) {
        throw new Error("Cannot update a system default record template");
    }
    // Prevent user from manually maliciously setting is_default to false
    if (updateData.is_default !== undefined) {
        delete updateData.is_default;
    }
    await template.update(updateData);
    return template;
};

export const deleteTemplate = async (id) => {
    const template = await RecordTemplate.findByPk(id);
    if (!template) {
        throw new Error("Template not found");
    }
    if (template.is_default) {
        throw new Error("Cannot delete a system default record template");
    }

    // Check if the template is being used by any medical records
    const inUseCount = await MedicalRecord.count({ where: { template_id: id } });
    if (inUseCount > 0) {
        throw new Error("Cannot delete this template because it is currently used by one or more medical records.");
    }

    await template.destroy(); // Hard delete or soft depending on setup, currently hard unless paranoid
    return { id };
};


// ======================= MEDICAL RECORDS =======================

export const getAllRecords = async (query) => {
    let whereClause = {};

    if (query.pet_id) {
        whereClause.pet_id = query.pet_id;
    }

    if (query.client_id) {
        whereClause.client_id = query.client_id;
    }

    const { count, rows } = await MedicalRecord.findAndCountAll({
        where: whereClause,
        include: [
            { model: Pet, as: 'pet', attributes: ['id', 'name', 'breed', 'pet_type'] },
            { model: Client, as: 'client', attributes: ['id', 'first_name', 'last_name'] },
            { model: RecordTemplate, as: 'template', attributes: ['id', 'name'] }
        ],
        order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });

    return { total: count, data: rows };
};

export const getRecordById = async (id) => {
    const record = await MedicalRecord.findByPk(id, {
        include: [
            { model: Pet, as: 'pet', attributes: ['id', 'name', 'breed', 'pet_type'] },
            { model: Client, as: 'client', attributes: ['id', 'first_name', 'last_name'] },
            { model: RecordTemplate, as: 'template', attributes: ['id', 'name', 'fields'] }
        ],
    });
    if (!record) {
        throw new Error("Medical Record not found");
    }
    return record;
};

export const createRecord = async (recordData) => {
    // If client is missing, we can fetch it from the pet
    if (!recordData.client_id && recordData.pet_id) {
        const pet = await Pet.findByPk(recordData.pet_id);
        if (pet && pet.client_id) {
            recordData.client_id = pet.client_id;
        }
    }

    const record = await MedicalRecord.create(recordData);
    return record;
};

export const updateRecord = async (id, updateData) => {
    const record = await MedicalRecord.findByPk(id);
    if (!record) {
        throw new Error("Medical Record not found");
    }
    await record.update(updateData);
    return record;
};

export const deleteRecord = async (id) => {
    const record = await MedicalRecord.findByPk(id);
    if (!record) {
        throw new Error("Medical Record not found");
    }
    await record.destroy();
    return { id };
};

export default {
    getAllRecordTypes,
    getRecordTypeById,
    createRecordType,
    updateRecordType,
    deleteRecordType,
    getAllTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getAllRecords,
    getRecordById,
    createRecord,
    updateRecord,
    deleteRecord
};
