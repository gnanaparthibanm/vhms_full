import { sequelize } from './src/db/index.js';
import { RecordType, RecordTemplate } from './src/hms/records/models/records.models.js';

const waggyvetDefaultTypes = [
    { name: "Annual Wellness Exam", category: "examination", templateRequired: true },
    { name: "Dental Examination", category: "examination", templateRequired: true },
    { name: "Emergency Visit", category: "urgent", templateRequired: true },
    { name: "Medical Consultation", category: "consultation", templateRequired: true },
    { name: "Surgical Procedure", category: "procedure", templateRequired: true },
    { name: "Vaccination Record", category: "preventive", templateRequired: true },
];

const waggyvetDefaultTemplates = [
    {
        name: "Standard Wellness Assessment",
        record_type: "Annual Wellness Exam",
        version: 1,
        fields: [
            { id: 1, label: "Weight (kg)", type: "number", required: true },
            { id: 2, label: "Temperature (C)", type: "number", required: false },
            { id: 3, label: "Heart Rate (bpm)", type: "number", required: false },
            { id: 4, label: "Respiratory Rate", type: "number", required: false },
            { id: 5, label: "Body Condition", type: "select", options: "Underweight, Ideal, Overweight, Obese", required: true },
            { id: 6, label: "General Appearance", type: "textarea", required: true },
            { id: 7, label: "Diet Discussed", type: "checkbox", required: false },
        ]
    },
    {
        name: "Dental Evaluation Form",
        record_type: "Dental Examination",
        version: 1,
        fields: [
            { id: 1, label: "Calculus Index", type: "select", options: "Grade 0, Grade 1, Grade 2, Grade 3, Grade 4", required: true },
            { id: 2, label: "Gingivitis Index", type: "select", options: "Grade 0, Grade 1, Grade 2, Grade 3", required: true },
            { id: 3, label: "Missing Teeth Noted", type: "text", required: false },
            { id: 4, label: "Periodontal Pockets", type: "textarea", required: false },
            { id: 5, label: "Extraction Recommendation", type: "checkbox", required: true }
        ]
    },
    {
        name: "Emergency Triage",
        record_type: "Emergency Visit",
        version: 1,
        fields: [
            { id: 1, label: "Chief Complaint", type: "text", required: true },
            { id: 2, label: "Triage Priority", type: "select", options: "Low, Medium, High, Critical", required: true },
            { id: 3, label: "Vital Signs Stable", type: "checkbox", required: true },
            { id: 4, label: "Initial Assessment", type: "textarea", required: true }
        ]
    },
    {
        name: "Routine Consultation",
        record_type: "Medical Consultation",
        version: 1,
        fields: [
            { id: 1, label: "Reason for Visit", type: "text", required: true },
            { id: 2, label: "Observations", type: "textarea", required: false },
            { id: 3, label: "Plan / Next Steps", type: "textarea", required: true },
            { id: 4, label: "Follow-up Required", type: "checkbox", required: false }
        ]
    },
    {
        name: "Surgical Operative Report",
        record_type: "Surgical Procedure",
        version: 1,
        fields: [
            { id: 1, label: "Procedure Performed", type: "text", required: true },
            { id: 2, label: "Surgeon", type: "text", required: true },
            { id: 3, label: "Anesthesia Used", type: "text", required: false },
            { id: 4, label: "Pre-Op Condition", type: "textarea", required: false },
            { id: 5, label: "Operative Notes", type: "textarea", required: true },
            { id: 6, label: "Complications", type: "text", required: false }
        ]
    },
    {
        name: "Vaccine Administration Log",
        record_type: "Vaccination Record",
        version: 1,
        fields: [
            { id: 1, label: "Vaccine Name", type: "select", options: "Rabies, DHPP, FVRCP, Bordetella, Lyme, Lepto", required: true },
            { id: 2, label: "Manufacturer", type: "text", required: false },
            { id: 3, label: "Serial/Lot Number", type: "text", required: true },
            { id: 4, label: "Date Administered", type: "date", required: true },
            { id: 5, label: "Route", type: "select", options: "SQ, IM, IN, Oral", required: true },
            { id: 6, label: "Next Due Date", type: "date", required: false }
        ]
    }
];

const seedRecords = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection OK!');

        // 1. CLEAR previous default records to avoid piling them up
        await RecordTemplate.destroy({ where: { is_default: true } });
        await RecordType.destroy({ where: { is_default: true } });

        // 2. Insert Default Record Types
        for (const t of waggyvetDefaultTypes) {
            // Check if already exists by name before inserting (just in case)
            const exists = await RecordType.findOne({ where: { name: t.name } });
            if (!exists) {
                await RecordType.create({ ...t, is_default: true });
            } else {
                await exists.update({ is_default: true });
            }
        }
        console.log('Seeded Default Record Types.');

        // 3. Insert Default Templates
        for (const temp of waggyvetDefaultTemplates) {
            const exists = await RecordTemplate.findOne({ where: { name: temp.name } });
            if (!exists) {
                await RecordTemplate.create({ ...temp, is_default: true });
            } else {
                await exists.update({ is_default: true, fields: temp.fields });
            }
        }
        console.log('Seeded Default Record Templates.');

        console.log('Successfully Seeded Default WaggyVet Records Data.');
        process.exit(0);
    } catch (e) {
        console.error('Migration failed: ', e);
        process.exit(1);
    }
};

seedRecords();
