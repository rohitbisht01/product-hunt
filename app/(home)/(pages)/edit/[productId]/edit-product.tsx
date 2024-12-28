"use client";

import EditProductModal from "@/components/ui/modals/edit-product-modal";
import { useState } from "react";
import { PiPencil } from "react-icons/pi";
import EditProductForm from "./edit-product-form";

interface EditProductProps {
  product: any;
}

const EditProduct = ({ product }: EditProductProps) => {
  const [editProductModalVisible, setEditProductModalVisible] = useState(false);

  const handleEditProductClick = () => {
    setEditProductModalVisible(true);
  };

  return (
    <>
      <button
        className="bg-emerald-100 p-4 rounded-md flex items-center justify-center cursor-pointer"
        onClick={handleEditProductClick}
      >
        <PiPencil className="text-xl text-emerald-500" />
      </button>

      <EditProductModal
        visible={editProductModalVisible}
        setVisible={setEditProductModalVisible}
      >
        <EditProductForm product={product} />
      </EditProductModal>
    </>
  );
};

export default EditProduct;
