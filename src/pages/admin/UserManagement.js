import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import PortalBackground from "../../components/portal/PortalBackground";
import { getUser } from "../../services/auth/authService";
import {
  getUsers,
  hapusUser,
  resetPasswordUser,
  tambahUser,
} from "../../services/admin/userManagementApi";
import AddUserModal from "../../components/admin/AddUserModal";
import AdminAccessDenied from "../../components/admin/AdminAccessDenied";
import DeleteUserModal from "../../components/admin/DeleteUserModal";
import ResetPasswordModal from "../../components/admin/ResetPasswordModal";
import UserManagementHeader from "../../components/admin/UserManagementHeader";
import UserManagementSummary from "../../components/admin/UserManagementSummary";
import UserTable from "../../components/admin/UserTable";
import {
  getUserId,
  getUserName,
  initialResetForm,
  initialUserForm,
} from "../../components/admin/userManagementHelpers";

export default function UserManagement() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const isAdmin = currentUser?.role === "admin";

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [userForm, setUserForm] = useState(initialUserForm);
  const [resetForm, setResetForm] = useState(initialResetForm);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [addFeedback, setAddFeedback] = useState(null);
  const [resetFeedback, setResetFeedback] = useState(null);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const roleA = a?.role || "";
      const roleB = b?.role || "";
      if (roleA !== roleB) return roleA.localeCompare(roleB);
      return getUserName(a).localeCompare(getUserName(b));
    });
  }, [users]);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;

    setUsersLoading(true);
    setUsersError("");

    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setUsersError(error.message);
    } finally {
      setUsersLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const updateUserForm = (field, value) => {
    setUserForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateResetForm = (field, value) => {
    setResetForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const selectUserForReset = (user) => {
    const userId = getUserId(user);
    if (user?.role === "admin") return;

    setSelectedUser(user);
    setResetFeedback(null);
    setResetForm((current) => ({
      ...current,
      id_user_target: userId,
    }));
    setShowResetModal(true);
  };

  const selectUserForDelete = (user) => {
    if (user?.role === "admin") return;
    setSelectedDeleteUser(user);
  };

  const openAddModal = () => {
    setAddFeedback(null);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    if (addLoading) return;
    setShowAddModal(false);
  };

  const closeResetModal = () => {
    if (resetLoading) return;
    setShowResetModal(false);
    setSelectedUser(null);
    setResetForm(initialResetForm);
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    setAddLoading(true);
    setAddFeedback(null);

    try {
      const response = await tambahUser({
        nama_lengkap: userForm.nama_lengkap.trim(),
        username: userForm.username.trim(),
        email: userForm.email.trim(),
        password: userForm.password,
        role: userForm.role,
      });

      setAddFeedback({
        type: "success",
        message: response.message || "User baru berhasil ditambahkan.",
      });
      setUserForm(initialUserForm);
      await loadUsers();
    } catch (error) {
      setAddFeedback({
        type: "error",
        message: error.message,
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setResetLoading(true);
    setResetFeedback(null);

    try {
      const response = await resetPasswordUser({
        id_user_target: resetForm.id_user_target,
        password_baru: resetForm.password_baru,
      });

      setResetFeedback({
        type: "success",
        message: response.message || "Password user berhasil direset.",
      });
      setResetForm(initialResetForm);
      setSelectedUser(null);
    } catch (error) {
      setResetFeedback({
        type: "error",
        message: error.message,
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    const userId = getUserId(selectedDeleteUser);
    if (!userId || selectedDeleteUser?.role === "admin") return;

    setDeleteLoading(true);

    try {
      await hapusUser(userId);
      setSelectedDeleteUser(null);
      await loadUsers();
    } catch (error) {
      setUsersError(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteUser = () => {
    if (!deleteLoading) {
      setSelectedDeleteUser(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fbff]">
      <PortalBackground />
      <UserManagementHeader onBack={() => navigate("/portal")} />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {!isAdmin ? (
          <AdminAccessDenied />
        ) : (
          <div className="space-y-6">
            <UserManagementSummary currentUser={currentUser} />
            <UserTable
              users={sortedUsers}
              usersLoading={usersLoading}
              usersError={usersError}
              selectedResetUserId={resetForm.id_user_target}
              onAdd={openAddModal}
              onRefresh={loadUsers}
              onReset={selectUserForReset}
              onDelete={selectUserForDelete}
            />
          </div>
        )}
      </main>

      {showAddModal && (
        <AddUserModal
          form={userForm}
          feedback={addFeedback}
          loading={addLoading}
          onChange={updateUserForm}
          onClose={closeAddModal}
          onSubmit={handleAddUser}
        />
      )}

      {showResetModal && (
        <ResetPasswordModal
          selectedUser={selectedUser}
          form={resetForm}
          feedback={resetFeedback}
          loading={resetLoading}
          onChange={updateResetForm}
          onClose={closeResetModal}
          onSubmit={handleResetPassword}
        />
      )}

      <DeleteUserModal
        user={selectedDeleteUser}
        loading={deleteLoading}
        onConfirm={handleDeleteUser}
        onCancel={cancelDeleteUser}
      />
    </div>
  );
}
