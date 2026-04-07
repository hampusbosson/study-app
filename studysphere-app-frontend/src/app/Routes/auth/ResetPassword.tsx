import React, { useState } from "react";
import { AxiosError } from "axios";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../lib/auth";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../features/auth/components/ConfirmationModal";
import { paths } from "../../../config/paths";
import Logo from "../../../components/ui/Header/Logo";

const ResetPassword: React.FC = () => {
  const inputClassName =
    "w-full rounded-lg border border-border bg-surface px-3 py-3 text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]";
  const primaryButtonClassName =
    "w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white transition duration-200 hover:bg-accentHover";
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extract the token from URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, newPassword);
      setModalMessage('Password succesfully reset!');
      setModalVisible(true);
    } catch (error) {
        if (error instanceof AxiosError) {
            setErrorMessage("An error occurred. Please try again.");
        } else {
            setErrorMessage("An error occurred. Please try again.");
        }
    }
  };

  const handleLoginRedirect = () => navigate(paths.auth.login.getHref());

  const handleModalClose = () => setModalVisible(false);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <div className="absolute top-4 left-4 p-2">
        <Logo clickable={true} size={48} />
      </div>
      <div className="w-full max-w-md rounded-lg border border-border bg-surface px-6 py-8 shadow-sm sm:px-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold text-text">Reset your password</h1>
          <p className="text-sm font-medium text-muted">Choose a new password for your account.</p>
        </div>
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClassName}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClassName}
          />
          {errorMessage && <p className="-mt-2 text-xs text-red-500">{errorMessage}</p>}
          <button type="submit" className={primaryButtonClassName}>
            Reset Password
          </button>
          <button
            className="rounded-lg px-3 py-2 font-semibold text-muted transition hover:bg-surfaceAlt hover:text-text"
            onClick={handleLoginRedirect}
          >
            Login
          </button>
        </form>
      </div>
      {modalVisible && (
        <ConfirmationModal message={modalMessage} onClose={handleModalClose}/>
      )} 
    </div>
  );
};

export default ResetPassword;
