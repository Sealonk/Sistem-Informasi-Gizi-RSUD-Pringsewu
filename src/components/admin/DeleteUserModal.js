import { AlertTriangle } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModal";
import { getUserName } from "./userManagementHelpers";

export default function DeleteUserModal({
  user,
  loading,
  onConfirm,
  onCancel,
}) {
  return (
    <ConfirmationModal
      isOpen={Boolean(user)}
      title="Hapus User"
      message={`Apakah Anda yakin ingin menghapus user ${getUserName(user)}? Tindakan ini tidak dapat dibatalkan.`}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={loading ? "Menghapus..." : "Ya, Hapus"}
      cancelText="Batal"
      confirmColor="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-rose-200/50"
      iconBg="bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-rose-200/50"
      icon={<AlertTriangle size={24} className="animate-pulse" />}
    />
  );
}
