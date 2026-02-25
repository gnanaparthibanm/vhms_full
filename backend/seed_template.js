import { sequelize } from "./src/db/index.js";
import { RecordType, RecordTemplate } from "./src/hms/records/models/records.models.js";

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");

        // Ensure the Record Type exists first
        const [recordType] = await RecordType.findOrCreate({
            where: { name: "Medical Consultation" },
            defaults: {
                category: "consultation",
                templateRequired: true,
                isActive: true,
                is_default: false,
            },
        });

        console.log("Record Type ensured:", recordType.id);

        // Create the Template
        const template = await RecordTemplate.create({
            id: "b9fbd349-8de2-40a7-ac69-5e5032429464",
            name: "Medical Consultation Template",
            record_type: recordType.id, // Must correspond to the actual type ID
            version: 1,
            isActive: true,
            fields: [
                {
                    id: "45541b56-d65b-49ea-91ba-45bd7ab0f20b",
                    label: "Symptom Onset",
                    type: "select",
                    required: true,
                    options: ["Sudden", "Gradual", "Chronic", "Unknown"],
                },
                {
                    id: "43c5d017-ed26-4e54-9650-d3aaa6e7e897",
                    label: "Detailed Symptom Description",
                    type: "textarea",
                    required: true,
                },
                {
                    id: "cb413166-00f0-4dd4-815d-6defc312181b",
                    label: "System Review",
                    type: "select",
                    required: true,
                    options: [
                        "Respiratory",
                        "Cardiovascular",
                        "Gastrointestinal",
                        "Neurological",
                        "Musculoskeletal",
                        "Dermatological",
                        "Urogenital",
                        "Multiple Systems",
                    ],
                },
                {
                    id: "745892ce-de28-4206-83a4-7e7e222205b8",
                    label: "Detailed Clinical Findings",
                    type: "textarea",
                    required: true,
                },
                {
                    id: "53b405f6-4f21-4410-9f98-3daaa7b33f89",
                    label: "Test Name",
                    type: "text",
                    required: true,
                },
                {
                    id: "dbcf854c-bebc-496c-a07a-d20164f0ccae",
                    label: "Test Result",
                    type: "select",
                    required: true,
                    options: ["Normal", "Abnormal", "Pending", "Inconclusive"],
                },
                {
                    id: "f3e7fb59-087d-478a-a616-7840c474c26a",
                    label: "Test Details",
                    type: "textarea",
                    required: false,
                },
                {
                    id: "b5996b63-77b8-45e4-8ee4-863295b264ec",
                    label: "Primary Diagnosis",
                    type: "text",
                    required: true,
                },
                {
                    id: "621ca681-fde6-4b52-a92b-8971a11242fc",
                    label: "Detailed Treatment Plan",
                    type: "textarea",
                    required: true,
                },
                {
                    id: "fedc713f-ce89-4299-88b4-c6aabb51c6b1",
                    label: "Additional Notes",
                    type: "textarea",
                    required: false,
                },
                {
                    id: "1e366143-df05-4418-bcf8-993f17f3eec5",
                    label: "Follow-Up Recommendations",
                    type: "textarea",
                    required: false,
                },
            ],
        });

        console.log("Template generated! ID:", template.id);
    } catch (error) {
        console.error("Error creating template:", error);
    } finally {
        process.exit(0);
    }
};

seedData();
