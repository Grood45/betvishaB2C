import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchGetRequest, sendDeleteRequest, sendPatchRequest } from '../api/api';
import { useToast } from '@chakra-ui/react';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { MdDelete, MdEdit } from 'react-icons/md';
import { checkPermission } from '../../utils/utils';
import AddQuickLinkModal from '../Modals/AddQuickLinkModal';
import { FaUser, FaMoneyBillAlt, FaGamepad, FaLink } from 'react-icons/fa';
import { VscGraph } from 'react-icons/vsc';
import { IoSettings } from 'react-icons/io5';
import { BsBank2 } from 'react-icons/bs';

const QuickLinksManage = () => {
    const { border, bg, iconColor } = useSelector((state) => state.theme);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [shortcuts, setShortcuts] = useState([]);
    const [editData, setEditData] = useState(null);
    const toast = useToast();

    const user = useSelector((state) => state.authReducer);
    const adminData = user.user || {};
    const isOwnerAdmin = adminData?.role_type === 'owneradmin';
    const permissionDetails = user?.user?.permissions;
    let hasPermission = checkPermission(permissionDetails, "seoManage"); // Same permission as setting
    let check = !isOwnerAdmin ? hasPermission : true;

    const getAllShortcuts = async () => {
        setLoading(true);
        try {
            let url = `${import.meta.env.VITE_API_URL}/api/admin/get-shortcuts`;
            let response = await fetchGetRequest(url);
            setShortcuts(response.data || []);
            setLoading(false);
        } catch (error) {
            toast({ description: error?.data?.message || "Failed to fetch quick links", status: "error", duration: 3000 });
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllShortcuts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this shortcut?")) return;
        try {
            let url = `${import.meta.env.VITE_API_URL}/api/admin/delete-shortcut/${id}`;
            await sendDeleteRequest(url);
            toast({ description: "Shortcut Deleted!", status: "success", duration: 3000 });
            getAllShortcuts();
        } catch (error) {
            toast({ description: error?.data?.message || "Failed to delete", status: "error", duration: 3000 });
        }
    };

    const toggleStatus = async (item) => {
        try {
            let url = `${import.meta.env.VITE_API_URL}/api/admin/update-shortcut/${item._id}`;
            await sendPatchRequest(url, { ...item, status: !item.status });
            toast({ description: "Status Updated", status: "success", duration: 2000 });
            getAllShortcuts();
        } catch (error) {
            toast({ description: "Failed to update status", status: "error" });
        }
    };

    const getIcon = (iconName) => {
        const icons = {
            FaUser: <FaUser />,
            FaMoneyBillAlt: <FaMoneyBillAlt />,
            VscGraph: <VscGraph />,
            IoSettings: <IoSettings />,
            FaGamepad: <FaGamepad />,
            BsBank2: <BsBank2 />,
            FaLink: <FaLink />
        };
        return icons[iconName] || <FaLink />;
    };

    return (
        <div className="container mx-auto p-4 lg:p-8">
            <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8" style={{ border: `1px solid ${border}` }}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <span style={{ backgroundColor: `${iconColor}20`, color: iconColor }} className="p-2 rounded-xl">
                                <IoSettings />
                            </span>
                            Quick Links Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Create and manage dynamic shortcuts that will appear on the main dashboard.</p>
                    </div>
                    {check && <AddQuickLinkModal getAllShortcuts={getAllShortcuts} />}
                </div>

                {loading ? (
                    <div className='flex w-[100%] py-12 justify-center items-center'>
                        <LoadingSpinner size="xl" thickness={"4px"} />
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {shortcuts.map((item) => (
                            <div key={item._id} className="group relative bg-white border rounded-2xl p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ border: `1px solid ${border}` }}>

                                <div className="flex justify-between items-start mb-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex justify-center items-center text-xl shadow-sm"
                                        style={{ backgroundColor: `${bg}15`, color: bg }}
                                    >
                                        {getIcon(item.icon)}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {check && (
                                            <>
                                                <button onClick={() => setEditData(item)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                                    <MdEdit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                                                    <MdDelete size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h3>
                                    <p className="text-xs text-blue-500 font-mono bg-blue-50 inline-block px-2 py-1 rounded truncate max-w-full">
                                        {item.path}
                                    </p>
                                </div>

                                <div className="mt-5 pt-4 border-t flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-500">Status</span>
                                    <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" className="sr-only peer" checked={item.status} onChange={() => toggleStatus(item)} disabled={!check} />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>

                            </div>
                        ))}

                        {shortcuts.length === 0 && (
                            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-2xl" style={{ borderColor: border }}>
                                <div style={{ color: iconColor }} className="text-5xl flex justify-center mb-3"><IoSettings opacity={0.3} /></div>
                                <h3 className="text-lg font-bold text-gray-700">No Quick Links Found</h3>
                                <p className="text-gray-500 text-sm mt-1">Click the "Add Quick Link" button to create your first shortcut.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {editData && <AddQuickLinkModal getAllShortcuts={getAllShortcuts} editData={editData} onCloseEdit={() => setEditData(null)} />}
        </div>
    );
};

export default QuickLinksManage;
