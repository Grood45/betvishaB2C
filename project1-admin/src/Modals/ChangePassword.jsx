import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Switch,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { IoKeyOutline, IoRefreshOutline, IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { MdOutlineFingerprint, MdOutlineAccessTime } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { PiShieldCheck } from "react-icons/pi";
import { FiAlertTriangle } from "react-icons/fi";

import LoadingSpinner from "../component/loading/LoadingSpinner";
import { sendPatchRequest } from "../api/api";

function ChangePassword({ type, id, icon, userName = 'user1', userCountry = 'Sri Lanka', countryFlag = '🇮🇳' }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI Only Toggles
  const [sendNotification, setSendNotification] = useState(true);
  const [forceLogout, setForceLogout] = useState(true);
  const [requireVerification, setRequireVerification] = useState(false);

  // Original state and redux
  const { color, primaryBg, secondaryBg, iconColor, bg, hoverColor, hover, text, font, border } = useSelector(state => state.theme);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // Preserved handle function
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const payload = {
        password: password,
        [type === "user" ? "user_id" : "admin_id"]: id,
      };
      setLoading(true);

      try {
        let url;
        if (type === "user") {
          url = `${import.meta.env.VITE_API_URL}/api/admin/user-reset-password`;
        } else if (type === "admin") {
          url = `${import.meta.env.VITE_API_URL}/api/admin/admin-reset-password`;
        }

        const response = await sendPatchRequest(url, payload);
        toast({
          title: response.message,
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        setLoading(false);
        onClose();
        setPassword("");
        setConfirmPassword("");
      } catch (error) {
        toast({
          title: error?.response?.data?.message || "An error occurred",
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        console.log(error, "erroro");
      }
      setLoading(false);
    } else {
      toast({
        title: "Both passwords are not same",
        status: "warning",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <button
        onClick={onOpen}
        style={{ border: `1px solid ${border}`, backgroundColor: primaryBg }}
        className={`w-[25px] flex items-center border justify-center rounded-[6px] h-[25px]`}
      >
        {icon || <RiLockPasswordFill style={{ color: iconColor }} fontSize={"15px"} />}
      </button>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent borderRadius="xl" maxW="600px">
          <ModalCloseButton mt={3} />

          {/* Header */}
          <ModalHeader className="border-b" pb={4}>
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-full text-blue-500 bg-blue-50">
                <IoKeyOutline size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{t('Change Password')}</h2>
                <p className="text-sm text-gray-500 font-normal">Update password for {type} - {userName}</p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody p={0}>
            {/* User Info Card */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{userName}</h3>
                  <p className="text-xs text-gray-500">ID: {type === 'user' ? 'USR' : 'ADM'}{id?.substring(0, 6) || "000001"} • {userCountry} {countryFlag}</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Last Login</p>
                  <p className="font-semibold text-gray-800">19/02/2026</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Device</p>
                  <p className="font-semibold text-gray-800">Mobile</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Status</p>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">active</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleUpdatePassword}>

                {/* Password Inputs */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-sm text-gray-700" htmlFor="password">
                      <IoLockClosedOutline /> New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-4 py-2.5 outline-none border rounded-lg focus:border-blue-500 transition-colors"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        id="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                      />
                      <div className="absolute top-0 right-0 h-full flex items-center pr-3 gap-2">
                        <IoRefreshOutline className="text-blue-500 cursor-pointer hover:text-blue-700" size={18} />
                        <button
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? <IoEyeSharp size={20} /> : <IoEyeOffSharp size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-sm text-gray-700" htmlFor="confirm_password">
                      <PiShieldCheck /> Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-4 py-2.5 outline-none border rounded-lg focus:border-blue-500 transition-colors"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        id="confirm_password"
                        name="confirm_password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        required
                      />
                      <div className="absolute top-0 right-0 h-full flex items-center pr-3">
                        <button
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          type="button"
                        >
                          {showConfirmPassword ? <IoEyeSharp size={20} /> : <IoEyeOffSharp size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Toggle 1 */}
                  <div className="border rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <IoMailOutline size={22} className="text-indigo-500" />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">Send Notification</p>
                        <p className="text-xs text-gray-500">Email user about password change</p>
                      </div>
                    </div>
                    <Switch colorScheme="blue" isChecked={sendNotification} onChange={(e) => setSendNotification(e.target.checked)} />
                  </div>

                  {/* Toggle 2 */}
                  <div className="border rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <IoLockClosedOutline size={22} className="text-red-500" />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">Force Logout</p>
                        <p className="text-xs text-gray-500">Log out user from all devices</p>
                      </div>
                    </div>
                    <Switch colorScheme="blue" isChecked={forceLogout} onChange={(e) => setForceLogout(e.target.checked)} />
                  </div>

                  {/* Toggle 3 */}
                  <div className="border rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <MdOutlineFingerprint size={22} className="text-purple-500" />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">Require Verification</p>
                        <p className="text-xs text-gray-500">User must verify via email/SMS</p>
                      </div>
                    </div>
                    <Switch colorScheme="blue" isChecked={requireVerification} onChange={(e) => setRequireVerification(e.target.checked)} />
                  </div>

                  {/* Immediate Effect (Static display instead of toggle) */}
                  <div className="border rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <MdOutlineAccessTime size={22} className="text-green-500" />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">Immediate Effect</p>
                        <p className="text-xs text-gray-500">Password changes instantly</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                      <PiShieldCheck size={18} /> Active
                    </div>
                  </div>
                </div>

                {/* Textarea */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 mb-2 font-semibold text-sm text-gray-700">
                    <IoMdInformationCircleOutline size={18} /> Admin Notes (Optional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 outline-none border rounded-xl focus:border-blue-500 transition-colors text-sm resize-none"
                    rows="3"
                    placeholder="Add notes about this password change for audit purposes..."
                  ></textarea>
                </div>

                {/* Security Tips */}
                <div className="border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <PiShieldCheck size={20} className="text-blue-500" />
                    <h4 className="font-bold text-sm text-gray-800">Security Tips</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                    <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Use at least 8 characters</p>
                    <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Include uppercase & lowercase</p>
                    <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Add numbers and symbols</p>
                    <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Avoid common words</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <span className="text-yellow-500"><FiAlertTriangle size={18} /></span>
                    <p>This action will immediately change the user's <br /> password.</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 font-medium text-gray-600 hover:text-gray-800 transition-colors rounded-lg"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <LoadingSpinner color="white" size="sm" thickness="2px" />
                      ) : (
                        <>
                          <IoKeyOutline size={18} /> Change Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChangePassword;
