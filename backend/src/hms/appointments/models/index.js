import Doctor from "../../staff/models/doctor.models.js";
import DoctorSchedules from "./doctorschedules.models.js";
import Appointments from "./appointments.models.js";
import Clients from "../../clients/models/clients.models.js";
import Pet from "../../clients/models/pet.models.js";
import Diagnosis from "./diagnosis.models.js";
import Prescriptions from "./prescriptions.models.js";
import PrescriptionItems from "./prescriptionitems.models.js";
import Product from "../../../ims/product/models/product.model.js";
import Treatments from "./treatments.models.js";
import Procedures from "./procedures.models.js";
import Vaccinations from "./vaccinations.models.js";
import FollowUps from "./followups.models.js";
import Bills from "./bills.models.js";
import BillItems from "./billitems.models.js";
import Payments from "./payments.models.js";
import Grooming from "./grooming.models.js";
import GroomingServices from "./groomingservices.models.js";
import GroomingPackages from "./groomingpackages.models.js";

DoctorSchedules.belongsTo(Doctor, { as: "doctor",foreignKey: "doctor_id" });
Appointments.belongsTo(Doctor, { as: "doctor",foreignKey: "doctor_id" });
Appointments.belongsTo(Clients, { as: "client", foreignKey: "client_id" });
Appointments.belongsTo(Pet, { as: "pet", foreignKey: "pet_id" });

// Prescription relationships
Pet.hasMany(Prescriptions, { as: "prescriptions", foreignKey: "pet_id" });
Prescriptions.belongsTo(Pet, { as: "pet", foreignKey: "pet_id" });

Diagnosis.hasMany(Prescriptions, { as: "prescriptions", foreignKey: "diagnosis_id" });
Prescriptions.belongsTo(Diagnosis, { as: "diagnosis", foreignKey: "diagnosis_id" });

Appointments.hasMany(Prescriptions, { as: "prescriptions", foreignKey: "appointment_id" });
Prescriptions.belongsTo(Appointments, { as: "appointment", foreignKey: "appointment_id" });

Prescriptions.hasMany(PrescriptionItems, { as: "items", foreignKey: "prescription_id" });
PrescriptionItems.belongsTo(Prescriptions, { as: "prescription", foreignKey: "prescription_id" });

PrescriptionItems.belongsTo(Product, { as: "product", foreignKey: "product_id" });
Product.hasMany(PrescriptionItems, { as: "prescription_items", foreignKey: "product_id" });

// Treatment relationships
Pet.hasMany(Treatments, { as: "treatments", foreignKey: "pet_id" });
Treatments.belongsTo(Pet, { as: "pet", foreignKey: "pet_id" });
Appointments.hasMany(Treatments, { as: "treatments", foreignKey: "appointment_id" });
Treatments.belongsTo(Appointments, { as: "appointment", foreignKey: "appointment_id" });
Diagnosis.hasMany(Treatments, { as: "treatments", foreignKey: "diagnosis_id" });
Treatments.belongsTo(Diagnosis, { as: "diagnosis", foreignKey: "diagnosis_id" });

// Procedure relationships
Pet.hasMany(Procedures, { as: "procedures", foreignKey: "pet_id" });
Procedures.belongsTo(Pet, { as: "pet", foreignKey: "pet_id" });
Appointments.hasMany(Procedures, { as: "procedures", foreignKey: "appointment_id" });
Procedures.belongsTo(Appointments, { as: "appointment", foreignKey: "appointment_id" });
Diagnosis.hasMany(Procedures, { as: "procedures", foreignKey: "diagnosis_id" });
Procedures.belongsTo(Diagnosis, { as: "diagnosis", foreignKey: "diagnosis_id" });
Procedures.belongsTo(Doctor, { as: "doctor", foreignKey: "doctor_id" });

// Vaccination relationships
Pet.hasMany(Vaccinations, { as: "vaccinations", foreignKey: "pet_id" });
Vaccinations.belongsTo(Pet, { as: "pet", foreignKey: "pet_id" });
Vaccinations.belongsTo(Appointments, { as: "appointment", foreignKey: "appointment_id" });
Vaccinations.belongsTo(Doctor, { as: "doctor", foreignKey: "doctor_id" });

// Follow-up relationships
Appointments.hasMany(FollowUps, { as: "follow_ups", foreignKey: "appointment_id" });
FollowUps.belongsTo(Appointments, { as: "appointment", foreignKey: "appointment_id" });
FollowUps.belongsTo(Diagnosis, { as: "diagnosis", foreignKey: "diagnosis_id" });

// Billing relationships
Appointments.hasMany(Bills, { as: "bills", foreignKey: "appointment_id" });
Bills.belongsTo(Appointments, { as: "appointment", foreignKey: "appointment_id" });
Bills.belongsTo(Pet, { as: "pet", foreignKey: "pet_id" });
Bills.belongsTo(Clients, { as: "client", foreignKey: "client_id" });

Bills.hasMany(BillItems, { as: "items", foreignKey: "bill_id" });
BillItems.belongsTo(Bills, { as: "bill", foreignKey: "bill_id" });

Bills.hasMany(Payments, { as: "payments", foreignKey: "bill_id" });
Payments.belongsTo(Bills, { as: "bill", foreignKey: "bill_id" });

// Grooming relationships
Appointments.hasOne(Grooming, { as: "grooming", foreignKey: "appointment_id" });
Grooming.belongsTo(Appointments, { as: "appointment", foreignKey: "appointment_id" });
Pet.hasMany(Grooming, { as: "grooming_sessions", foreignKey: "pet_id" });
Grooming.belongsTo(Pet, { as: "pet", foreignKey: "pet_id" });

Grooming.hasMany(GroomingServices, { as: "services", foreignKey: "grooming_id" });
GroomingServices.belongsTo(Grooming, { as: "grooming", foreignKey: "grooming_id" });
