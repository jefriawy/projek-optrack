// backend/controllers/customerController.js (FINAL VERSION DENGAN NOTIFIKASI)

const Customer = require("../models/customer");
const pool = require("../config/database");
const { generateUserId } = require("../utils/idGenerator");
const Sales = require("../models/sales"); 
const Notification = require("../models/notificationModel"); // Impor model notifikasi

const createCustomer = async (req, res) => {
  try {
    const customerData = req.body;

    // Server-side validation for NPWP
    if (customerData.customerCat === 'Perusahaan' && !customerData.NPWP) {
      return res.status(400).json({ error: "NPWP is required for company customers" });
    }

    // generate idCustomer
    customerData.idCustomer = await generateUserId("Customer");

    const userId = req.user.id;
    console.log(
      "Creating customer with data:",
      customerData,
      "userId:",
      userId
    );
    
    // req.user.id is the idSales
    const idSales = userId;
    const [salesRow] = await pool.query(
      "SELECT idSales FROM sales WHERE idSales = ?",
      [idSales]
    );
    if (!salesRow.length) {
      console.log("No Sales record found for idSales:", idSales);
      return res
        .status(400)
        .json({ error: "No Sales record found for this user" });
    }

    const newCustomer = await Customer.create(customerData, idSales);
    
    // START NOTIFIKASI BARU: Sales -> Head Sales (Customer ditambahkan)
    const salesUser = await Sales.findById(idSales);
    const salesName = salesUser ? salesUser.nmSales : 'Seorang Sales';
    
    await Notification.createNotification({
      recipientId: null, // Broadcast ke semua user dengan role Head Sales
      recipientRole: 'Head Sales',
      message: `Sales (${salesName}) Telah menambahkan Customer`,
      type: 'customer_added',
      senderId: idSales,
      senderName: salesName,
      relatedEntityId: customerData.idCustomer,
    });
    // END NOTIFIKASI BARU

    res.status(201).json({ message: "Customer created", data: newCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const getCustomers = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { status: statusFilter, corpCustomer, nmSales } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const searchParams = { searchTerm: corpCustomer || nmSales, searchBy: corpCustomer ? 'corpCustomer' : 'nmSales' };

    console.log("Fetching customers for user:", { userId, role, statusFilter, searchParams, page, limit });

    let customers;
    let totalCustomers;

    if (role === "Sales") {
      const idSales = userId;
      const [salesRow] = await pool.query(
        "SELECT idSales FROM sales WHERE idSales = ?",
        [idSales]
      );
      if (!salesRow.length) {
        return res.status(403).json({ error: "User is not a registered sales" });
      }
      customers = await Customer.findBySalesId(idSales, statusFilter, searchParams, limit, offset);
      totalCustomers = await Customer.countBySalesId(idSales, statusFilter, searchParams);
    } else if (role === "Admin" || role === "Head Sales") {
      customers = await Customer.findAll(statusFilter, searchParams, limit, offset);
      totalCustomers = await Customer.countAll(statusFilter, searchParams);
    } else {
      console.log("Unauthorized role:", role);
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const totalPages = Math.ceil(totalCustomers / limit);

    res.json({ data: customers, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const getStatusOptions = async (req, res) => {
  try {
    const statusOptions = await Customer.findStatusOptions();
    res.json(statusOptions);
  } catch (error) {
    console.error("Error fetching status options:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

// Fungsi ini menangani PUT /api/customer/:id (Update data customer non-status)
const handleCustomerUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = req.body;
    const { user } = req;
    
    // Ambil data lama, termasuk idStatCustomer dan idSales
    const existingCustomer = await Customer.findById(id); 
    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const oldStatusId = existingCustomer.idStatCustomer;

    if (customerData.customerCat === 'Perusahaan' && !customerData.NPWP) {
      return res.status(400).json({ error: "NPWP is required for company customers" });
    }

    // Pencegahan: Sales tidak boleh mengubah status melalui rute ini
    if (user.role === 'Sales') {
        if (customerData.idStatCustomer && String(customerData.idStatCustomer) !== String(oldStatusId)) {
            // Tolak jika Sales mencoba mengirim status baru yang berbeda dari status lama
            return res.status(403).json({ error: "Forbidden: Sales cannot directly update customer status." });
        }
    }

    // Lakukan update ke database
    const [result] = await pool.query(
      `UPDATE customer SET nmCustomer=?, mobileCustomer=?, emailCustomer=?, addrCustomer=?, corpCustomer=?, idStatCustomer=?, descCustomer=?, customerCat=?, NPWP=? WHERE idCustomer=?`,
      [
        customerData.nmCustomer,
        customerData.mobileCustomer || null,
        customerData.emailCustomer,
        customerData.addrCustomer || null,
        customerData.corpCustomer || null,
        // Pastikan status tidak berubah jika itu adalah Sales yang update
        customerData.idStatCustomer || oldStatusId, 
        customerData.descCustomer || null,
        customerData.customerCat,
        customerData.NPWP || null,
        id,
      ]
    );
    
    // NOTIFIKASI: Sales -> Head Sales (Customer diupdate)
    if (user.role === 'Sales') { 
      const salesUser = await Sales.findById(user.id);
      const salesName = salesUser ? salesUser.nmSales : 'Seorang Sales';
      
      await Notification.createNotification({
        recipientId: null,
        recipientRole: 'Head Sales',
        message: `Sales (${salesName}) Telah mengupdate Customer`,
        type: 'customer_updated',
        senderId: user.id,
        senderName: salesName,
        relatedEntityId: id,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer updated" });

  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: error.message });
  }
};


// FUNGSI BARU - Hanya untuk PUT /api/customer/:id/status
const updateCustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { idStatCustomer } = req.body;
        const { user } = req;

        if (!idStatCustomer) {
            return res.status(400).json({ error: "idStatCustomer is required." });
        }

        // 1. Ambil status lama dan idSales sebelum update
        const existingCustomer = await Customer.findById(id); 
        if (!existingCustomer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        const oldStatusId = existingCustomer.idStatCustomer;
        const idSalesPenerima = existingCustomer.idSales; 

        // 2. Lakukan update status ke database
        const [result] = await pool.query(
            `UPDATE customer SET idStatCustomer=? WHERE idCustomer=?`,
            [idStatCustomer, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Customer not found" });
        }
        
        // 3. Notifikasi Head Sales/Admin -> Sales (jika status berubah)
        if (String(idStatCustomer) !== String(oldStatusId)) {
            
            // Ambil nama status yang baru dari DB statcustomer
            const [statusRows] = await pool.query(
                "SELECT nmStatCustomer FROM statcustomer WHERE idStatCustomer = ?", 
                [idStatCustomer]
            );
            const newStatusName = statusRows.length ? statusRows[0].nmStatCustomer : `ID ${idStatCustomer}`;

            await Notification.createNotification({
                recipientId: idSalesPenerima,
                recipientRole: 'Sales',
                message: `Head Sales (${user.name}) Telah Mengupdate Status Customer menjadi ${newStatusName}`,
                type: 'customer_status_changed_sales',
                senderId: user.id,
                senderName: user.name,
                relatedEntityId: id,
            });
        }
        
        res.json({ message: "Customer status updated" });

    } catch (error) {
        console.error("Error updating customer status:", error);
        res.status(500).json({ error: error.message });
    }
};

// EKSPOR SEMUA FUNGSI (PENTING!)
module.exports = { 
    createCustomer, 
    getCustomers, 
    getStatusOptions, 
    getCustomerById, 
    updateCustomer: handleCustomerUpdate, // Diekspor sebagai updateCustomer untuk rute PUT /:id
    updateCustomerStatus, // Diekspor untuk rute PUT /:id/status
};