import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    useToast,
    FormControl,
    FormLabel,
    Select,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { sendPostRequest, sendPatchRequest } from '../api/api';
import { useTranslation } from 'react-i18next';
import { IoMdAddCircle } from 'react-icons/io';
import { IoSettings } from 'react-icons/io5';

function AddQuickLinkModal({ getAllShortcuts, editData = null, onCloseEdit = null }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { bg, border, iconColor, textColor, secondaryColor } = useSelector((state) => state.theme);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [path, setPath] = useState('');
    const [icon, setIcon] = useState('FaLink');
    const [status, setStatus] = useState(true);

    useEffect(() => {
        if (editData) {
            setTitle(editData.title);
            setPath(editData.path);
            setIcon(editData.icon);
            setStatus(editData.status);
            onOpen();
        }
    }, [editData, onOpen]);

    const handleClose = () => {
        setTitle('');
        setPath('');
        setIcon('FaLink');
        setStatus(true);
        onClose();
        if (onCloseEdit) onCloseEdit();
    };

    const handleSave = async () => {
        if (!title || !path) {
            return toast({
                description: `Please fill Title and Path`,
                status: "warning",
                duration: 4000,
                position: "top",
                isClosable: true,
            });
        }
        setLoading(true);

        const payload = { title, path, icon, status };

        try {
            if (editData) {
                let url = `${import.meta.env.VITE_API_URL}/api/admin/update-shortcut/${editData._id}`;
                await sendPatchRequest(url, payload);
                toast({ description: "Shortcut Updated Successfully", status: "success", duration: 3000, isClosable: true });
            } else {
                let url = `${import.meta.env.VITE_API_URL}/api/admin/create-shortcut`;
                await sendPostRequest(url, payload);
                toast({ description: "Shortcut Created Successfully", status: "success", duration: 3000, isClosable: true });
            }
            getAllShortcuts();
            handleClose();
        } catch (error) {
            toast({ description: error?.data?.message || "Something went wrong", status: "error", duration: 4000, isClosable: true });
        }
        setLoading(false);
    };

    const iconsList = [
        { label: "Link", value: "FaLink" },
        { label: "User", value: "FaUser" },
        { label: "Money", value: "FaMoneyBillAlt" },
        { label: "Chart", value: "VscGraph" },
        { label: "Settings", value: "IoSettings" },
        { label: "Gamepad", value: "FaGamepad" },
        { label: "Bank", value: "BsBank2" }
    ];

    return (
        <>
            {!editData && (
                <button
                    onClick={onOpen}
                    style={{ backgroundColor: bg }}
                    className="p-2 px-4 rounded-lg gap-2 flex items-center font-bold text-sm text-white shadow-md hover:opacity-90 transition-opacity"
                >
                    {t(`Add`)} {t(`Quick Link`)}
                    <IoMdAddCircle fontSize={"20px"} />
                </button>
            )}

            <Modal isOpen={isOpen} onClose={handleClose} isCentered>
                <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
                <ModalContent style={{ backgroundColor: secondaryColor || 'white', borderRadius: '16px', overflow: 'hidden' }}>
                    <ModalHeader style={{ color: textColor, borderBottom: `1px solid ${border}` }} className="bg-gray-50 flex items-center gap-2 pb-4">
                        <span style={{ backgroundColor: `${iconColor}20`, color: iconColor }} className="p-1.5 rounded-lg">
                            <IoSettings fontSize="20px" />
                        </span>
                        {editData ? "Edit" : "Add"} Quick Link
                    </ModalHeader>
                    <ModalCloseButton mt={1} />

                    <ModalBody className="py-6">
                        <div className='flex flex-col gap-4'>
                            <div>
                                <p className='text-sm font-semibold text-gray-700 mb-1'>Title</p>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder='e.g., Manage Users'
                                    style={{ border: `1px solid ${border}` }}
                                    className='rounded-lg w-[100%] p-2.5 outline-none focus:ring-2 transition-all'
                                />
                            </div>

                            <div>
                                <p className='text-sm font-semibold text-gray-700 mb-1'>Destination Path</p>
                                <input
                                    value={path}
                                    onChange={(e) => setPath(e.target.value)}
                                    placeholder='e.g., /usermanage'
                                    style={{ border: `1px solid ${border}` }}
                                    className='rounded-lg w-[100%] p-2.5 outline-none focus:ring-2 transition-all'
                                />
                            </div>

                            <div>
                                <p className='text-sm font-semibold text-gray-700 mb-1'>Select Icon</p>
                                <select
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    style={{ border: `1px solid ${border}` }}
                                    className='rounded-lg w-[100%] p-2.5 outline-none bg-white focus:ring-2 transition-all cursor-pointer'
                                >
                                    {iconsList.map((icData) => (
                                        <option key={icData.value} value={icData.value}>{icData.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <p className='text-sm font-semibold text-gray-700'>Status Activity:</p>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={status} onChange={(e) => setStatus(e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>

                        </div>
                    </ModalBody>

                    <ModalFooter style={{ borderTop: `1px solid ${border}` }} className="bg-gray-50">
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', width: '100%' }}>
                            <Button onClick={handleClose} variant="ghost" style={{ color: textColor }}>
                                Cancel
                            </Button>
                            <Button style={{ backgroundColor: bg, color: 'white' }} className='px-6 hover:shadow-lg transition-all' onClick={handleSave}>
                                {loading ? <LoadingSpinner color="white" size="sm" thickness="2px" /> : "Save Shortcut"}
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddQuickLinkModal;
