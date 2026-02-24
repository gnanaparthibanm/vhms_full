import Bills from "../models/bills.models.js";
import BillItems from "../models/billitems.models.js";
import Payments from "../models/payments.models.js";
import Appointments from "../models/appointments.models.js";
import Pet from "../../clients/models/pet.models.js";
import Clients from "../../clients/models/clients.models.js";
import { Op } from "sequelize";
import { sequelize } from "../../../db/index.js";

const billsService = {

  /**
   * ✅ Create Bill with Items
   */
  async create(data, userInfo = {}) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validate appointment, pet, and client
      const appointment = await Appointments.findByPk(data.appointment_id);
      if (!appointment) throw new Error("Appointment not found");

      const pet = await Pet.findByPk(data.pet_id);
      if (!pet) throw new Error("Pet not found");

      const client = await Clients.findByPk(data.client_id);
      if (!client) throw new Error("Client not found");

      // Calculate totals
      let totalAmount = 0;
      let totalTax = 0;

      const itemsWithCalculations = data.items.map(item => {
        const quantity = item.quantity || 1;
        const unitPrice = item.unit_price;
        const discount = item.discount || 0;
        
        // Determine if item is taxable based on item_type
        // Products (Medicine) are taxable, Services are not
        const isTaxable = item.is_taxable !== undefined 
          ? item.is_taxable 
          : (item.item_type === 'Medicine' || item.item_type === 'Lab');
        
        const taxPercentage = isTaxable ? (item.tax_percentage || 0) : 0;

        const subtotal = (unitPrice * quantity) - discount;
        const taxAmount = isTaxable ? (subtotal * taxPercentage) / 100 : 0;
        const totalPrice = subtotal + taxAmount;

        totalAmount += subtotal;
        totalTax += taxAmount;

        return {
          ...item,
          quantity,
          discount,
          tax_percentage: taxPercentage,
          tax_amount: taxAmount,
          is_taxable: isTaxable,
          total_price: totalPrice,
        };
      });

      const billDiscount = data.discount || 0;
      const netAmount = (totalAmount + totalTax) - billDiscount;

      // Create bill
      const bill = await Bills.create({
        bill_no: data.bill_no,
        appointment_id: data.appointment_id,
        pet_id: data.pet_id,
        client_id: data.client_id,
        bill_date: data.bill_date || new Date(),
        total_amount: totalAmount,
        discount: billDiscount,
        discount_percentage: data.discount_percentage || 0,
        tax_amount: totalTax,
        net_amount: netAmount,
        paid_amount: 0,
        balance_amount: netAmount,
        status: 'Pending',
        notes: data.notes,
        created_by: userInfo.id || null,
        created_by_name: userInfo.name || null,
        created_by_email: userInfo.email || null,
      }, { transaction });

      // Create bill items
      const billItems = itemsWithCalculations.map(item => ({
        bill_id: bill.id,
        item_type: item.item_type,
        item_id: item.item_id || null,
        item_name: item.item_name,
        item_code: item.item_code,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount,
        tax_percentage: item.tax_percentage,
        tax_amount: item.tax_amount,
        total_price: item.total_price,
      }));

      await BillItems.bulkCreate(billItems, { transaction });

      await transaction.commit();

      return await this.getById(bill.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * ✅ Get All Bills
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      appointment_id,
      pet_id,
      client_id,
      status,
      start_date,
      end_date,
      is_active = true,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (appointment_id) where.appointment_id = appointment_id;
    if (pet_id) where.pet_id = pet_id;
    if (client_id) where.client_id = client_id;
    if (status) where.status = status;
    if (is_active !== undefined) where.is_active = is_active;

    if (start_date && end_date) {
      where.bill_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const { count, rows } = await Bills.findAndCountAll({
      where,
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "pet_name", "species", "breed"],
        },
        {
          model: Clients,
          as: "client",
          attributes: ["id", "first_name", "last_name", "phone", "email"],
        },
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at"],
        },
        {
          model: BillItems,
          as: "items",
        },
        {
          model: Payments,
          as: "payments",
        },
      ],
      offset,
      limit: Number(limit),
      order: [["bill_date", "DESC"]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get Bill by ID
   */
  async getById(id) {
    const bill = await Bills.findByPk(id, {
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "pet_name", "species", "breed", "age", "gender"],
        },
        {
          model: Clients,
          as: "client",
          attributes: ["id", "first_name", "last_name", "phone", "email", "address"],
        },
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at", "visit_type"],
        },
        {
          model: BillItems,
          as: "items",
        },
        {
          model: Payments,
          as: "payments",
        },
      ],
    });
    
    if (!bill) throw new Error("Bill not found");
    return bill;
  },

  /**
   * ✅ Add Payment to Bill
   */
  async addPayment(billId, data, userInfo = {}) {
    const transaction = await sequelize.transaction();
    
    try {
      const bill = await Bills.findByPk(billId);
      if (!bill) throw new Error("Bill not found");

      if (bill.status === 'Paid') {
        throw new Error("Bill is already fully paid");
      }

      if (bill.status === 'Cancelled') {
        throw new Error("Cannot add payment to cancelled bill");
      }

      const paymentAmount = parseFloat(data.amount);
      const remainingBalance = parseFloat(bill.balance_amount);

      if (paymentAmount > remainingBalance) {
        throw new Error(`Payment amount (${paymentAmount}) exceeds remaining balance (${remainingBalance})`);
      }

      // Create payment
      const payment = await Payments.create({
        payment_no: data.payment_no,
        bill_id: billId,
        payment_mode: data.payment_mode,
        amount: paymentAmount,
        transaction_id: data.transaction_id,
        payment_reference: data.payment_reference,
        paid_at: data.paid_at || new Date(),
        notes: data.notes,
        created_by: userInfo.id || null,
        created_by_name: userInfo.name || null,
        created_by_email: userInfo.email || null,
      }, { transaction });

      // Update bill
      const newPaidAmount = parseFloat(bill.paid_amount) + paymentAmount;
      const newBalanceAmount = parseFloat(bill.net_amount) - newPaidAmount;

      let newStatus = 'Pending';
      if (newBalanceAmount === 0) {
        newStatus = 'Paid';
      } else if (newPaidAmount > 0) {
        newStatus = 'Partially_Paid';
      }

      await bill.update({
        paid_amount: newPaidAmount,
        balance_amount: newBalanceAmount,
        status: newStatus,
        updated_by: userInfo.id || null,
        updated_by_name: userInfo.name || null,
        updated_by_email: userInfo.email || null,
      }, { transaction });

      await transaction.commit();

      return await this.getById(billId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * ✅ Update Bill
   */
  async update(id, data, userInfo = {}) {
    const bill = await Bills.findByPk(id);
    if (!bill) throw new Error("Bill not found");

    if (bill.status === 'Paid') {
      throw new Error("Cannot update a paid bill");
    }

    await bill.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return await this.getById(id);
  },

  /**
   * ✅ Cancel Bill
   */
  async cancel(id, userInfo = {}) {
    const bill = await Bills.findByPk(id);
    if (!bill) throw new Error("Bill not found");

    if (bill.status === 'Paid' || bill.status === 'Partially_Paid') {
      throw new Error("Cannot cancel a bill with payments");
    }

    await bill.update({
      status: 'Cancelled',
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Bill cancelled successfully" };
  },

  /**
   * ✅ Get Payment History for Bill
   */
  async getPaymentHistory(billId) {
    const payments = await Payments.findAll({
      where: { bill_id: billId, is_active: true },
      order: [["paid_at", "DESC"]],
    });

    return payments;
  },

  /**
   * ✅ Get Monthly Tax Report
   */
  async getMonthlyTaxReport(options = {}) {
    const {
      year = new Date().getFullYear(),
      month = new Date().getMonth() + 1,
      start_date,
      end_date,
    } = options;

    let dateFilter = {};
    
    if (start_date && end_date) {
      dateFilter = {
        bill_date: {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        },
      };
    } else {
      // Default to specified month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      dateFilter = {
        bill_date: {
          [Op.between]: [startDate, endDate],
        },
      };
    }

    // Get all bills in the period
    const bills = await Bills.findAll({
      where: {
        ...dateFilter,
        status: { [Op.in]: ['Paid', 'Partially_Paid'] },
        is_active: true,
      },
      include: [
        {
          model: BillItems,
          as: "items",
          where: { is_taxable: true }, // Only taxable items
          required: false,
        },
        {
          model: Clients,
          as: "client",
          attributes: ["id", "first_name", "last_name", "phone"],
        },
      ],
      order: [["bill_date", "ASC"]],
    });

    // Calculate tax summary
    let totalTaxableAmount = 0;
    let totalTaxAmount = 0;
    const taxBreakdown = {};
    const itemTypeBreakdown = {};

    bills.forEach(bill => {
      bill.items.forEach(item => {
        if (item.is_taxable) {
          const subtotal = parseFloat(item.unit_price) * item.quantity - parseFloat(item.discount);
          const taxAmount = parseFloat(item.tax_amount);
          const taxRate = parseFloat(item.tax_percentage);

          totalTaxableAmount += subtotal;
          totalTaxAmount += taxAmount;

          // Tax rate breakdown
          if (!taxBreakdown[taxRate]) {
            taxBreakdown[taxRate] = {
              tax_rate: taxRate,
              taxable_amount: 0,
              tax_amount: 0,
              count: 0,
            };
          }
          taxBreakdown[taxRate].taxable_amount += subtotal;
          taxBreakdown[taxRate].tax_amount += taxAmount;
          taxBreakdown[taxRate].count += 1;

          // Item type breakdown
          if (!itemTypeBreakdown[item.item_type]) {
            itemTypeBreakdown[item.item_type] = {
              item_type: item.item_type,
              taxable_amount: 0,
              tax_amount: 0,
              count: 0,
            };
          }
          itemTypeBreakdown[item.item_type].taxable_amount += subtotal;
          itemTypeBreakdown[item.item_type].tax_amount += taxAmount;
          itemTypeBreakdown[item.item_type].count += 1;
        }
      });
    });

    return {
      period: start_date && end_date 
        ? { start_date, end_date }
        : { year, month, month_name: new Date(year, month - 1).toLocaleString('default', { month: 'long' }) },
      summary: {
        total_bills: bills.length,
        total_taxable_amount: parseFloat(totalTaxableAmount.toFixed(2)),
        total_tax_amount: parseFloat(totalTaxAmount.toFixed(2)),
        total_with_tax: parseFloat((totalTaxableAmount + totalTaxAmount).toFixed(2)),
      },
      tax_rate_breakdown: Object.values(taxBreakdown).map(item => ({
        ...item,
        taxable_amount: parseFloat(item.taxable_amount.toFixed(2)),
        tax_amount: parseFloat(item.tax_amount.toFixed(2)),
      })),
      item_type_breakdown: Object.values(itemTypeBreakdown).map(item => ({
        ...item,
        taxable_amount: parseFloat(item.taxable_amount.toFixed(2)),
        tax_amount: parseFloat(item.tax_amount.toFixed(2)),
      })),
      bills: bills.map(bill => ({
        bill_no: bill.bill_no,
        bill_date: bill.bill_date,
        client_name: `${bill.client.first_name} ${bill.client.last_name}`,
        total_amount: parseFloat(bill.total_amount),
        tax_amount: parseFloat(bill.tax_amount),
        net_amount: parseFloat(bill.net_amount),
        taxable_items: bill.items.filter(item => item.is_taxable).map(item => ({
          item_name: item.item_name,
          item_type: item.item_type,
          quantity: item.quantity,
          unit_price: parseFloat(item.unit_price),
          taxable_amount: parseFloat((item.unit_price * item.quantity - item.discount).toFixed(2)),
          tax_percentage: parseFloat(item.tax_percentage),
          tax_amount: parseFloat(item.tax_amount),
        })),
      })),
    };
  },

  /**
   * ✅ Get Tax Summary by Date Range
   */
  async getTaxSummary(startDate, endDate) {
    const bills = await Bills.findAll({
      where: {
        bill_date: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
        status: { [Op.in]: ['Paid', 'Partially_Paid'] },
        is_active: true,
      },
      include: [
        {
          model: BillItems,
          as: "items",
          where: { is_taxable: true },
          required: false,
        },
      ],
    });

    let totalTaxCollected = 0;
    let totalTaxableAmount = 0;

    bills.forEach(bill => {
      bill.items.forEach(item => {
        if (item.is_taxable) {
          totalTaxableAmount += parseFloat(item.unit_price) * item.quantity - parseFloat(item.discount);
          totalTaxCollected += parseFloat(item.tax_amount);
        }
      });
    });

    return {
      period: { start_date: startDate, end_date: endDate },
      total_taxable_amount: parseFloat(totalTaxableAmount.toFixed(2)),
      total_tax_collected: parseFloat(totalTaxCollected.toFixed(2)),
      total_bills: bills.length,
    };
  },
};

export default billsService;
