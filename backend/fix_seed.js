import { sequelize } from "./src/db/index.js";
import { RecordTemplate } from "./src/hms/records/models/records.models.js";

const fixData = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");

        const template = await RecordTemplate.findByPk("b9fbd349-8de2-40a7-ac69-5e5032429464");
        if (template) {
            if (template.record_type.length >= 36) {
                template.record_type = "Medical Consultation";
                await template.save();
                console.log("Fixed template recordType");
            } else {
                console.log("Template recordType is already a string:", template.record_type);
            }
        } else {
            console.log("Template not found");
        }
    } catch (error) {
        console.error("Error fixing template:", error);
    } finally {
        process.exit(0);
    }
};

fixData();
