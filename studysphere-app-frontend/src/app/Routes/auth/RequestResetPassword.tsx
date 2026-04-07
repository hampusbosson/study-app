import React, { useState } from "react";
import Logo from "../../../components/ui/Header/Logo";
import { sendResetPasswordLink } from "../../../lib/auth";
import { AxiosError } from "axios";
import ConfirmationModal from "../../../features/auth/components/ConfirmationModal";

const RequestResetPassword: React.FC = () => {
  const inputClassName =
    "w-full rounded-lg border border-border bg-surface px-3 py-3 text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]";
  const primaryButtonClassName =
    "w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white transition duration-200 hover:bg-accentHover disabled:cursor-not-allowed disabled:opacity-70";
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleModalClose = () => setModalVisible(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await sendResetPasswordLink(email);
      setLoading(false);
      setModalMessage("A reset link has been sent to your email!");
      setModalVisible(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        setModalMessage(
          "We could not find your email address. Make sure you've put in a valid email and that you have an account.",
        );
        setModalVisible(true);
      } else {
        console.error("Unexpected error:", error);
        setModalMessage(
          "We could not find your email address. Make sure you've put in a valid email and that you have an account.",
        );
        setModalVisible(true);
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <div className="absolute top-4 left-4 p-2">
        <Logo clickable={true} size={48} />
      </div>
      <div className="w-full max-w-md rounded-lg border border-border bg-surface px-6 py-8 shadow-sm sm:px-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold text-text md:text-5xl">Reset password</h1>
          <h2 className="font-semibold text-muted">
            Enter your email address and we&apos;ll send you a reset link.
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <input
            type="text"
            placeholder="Email Address"
            className={inputClassName}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className={primaryButtonClassName}>
            {loading ? "Loading.." : "Reset Password"}
          </button>
        </form>
      </div>
      {modalVisible && (
        <ConfirmationModal message={modalMessage} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default RequestResetPassword;
