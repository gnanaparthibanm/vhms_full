import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/ims/product/product`;

// 🔐 Get token helper
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Get All Products
export const getAllProducts = async () => {
  try {
    const res = await axios.get(BASE_URL, getAuthConfig());
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// ✅ Get Product By ID
export const getProductById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`, getAuthConfig());
  return res.data;
};

// ✅ Get Product By Code
export const getProductByCode = async (code) => {
  const res = await axios.get(`${BASE_URL}/code/${code}`, getAuthConfig());
  return res.data;
};

// ✅ Create Product
export const createProduct = async (data) => {
  const res = await axios.post(BASE_URL, data, getAuthConfig());
  return res.data;
};

// ✅ Update Product
export const updateProduct = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data, getAuthConfig());
  return res.data;
};

// ✅ Delete Product
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, getAuthConfig());
  return res.data;
};

// ✅ Get Prescription Products
export const getPrescriptionProducts = async () => {
  const res = await axios.get(
    `${BASE_URL}/prescription/list`,
    getAuthConfig()
  );
  return res.data;
};

// ✅ Validate Prescription Product
export const validatePrescriptionProduct = async (id) => {
  const res = await axios.get(
    `${BASE_URL}/prescription/validate/${id}`,
    getAuthConfig()
  );
  return res.data;
};