import React, { useEffect, useRef, useState } from 'react';
import { LuImport, LuTrash } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from '../api/api';
import { useToast, Switch, Tooltip } from '@chakra-ui/react';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { checkPermission } from '../../utils/utils';
import { FaCloudUploadAlt, FaImages, FaMobileAlt, FaGlobe, FaTrashAlt } from 'react-icons/fa';
import { MdAdminPanelSettings, MdBrandingWatermark, MdDelete } from 'react-icons/md';

const LogoBanner = () => {
  const { bg, border } = useSelector(state => state.theme);
  const [logoBannerData, setLogoBannerData] = useState({ carousels: [] });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Loading states for specific image uploads
  const [imageLoading, setImageLoading] = useState({
    logo: false,
    site_logo: false,
    site_fav_icon: false,
    site_logo_mobile: false,
    carousel: false
  });

  const [isSignupEnabled, setIsSignupEnabled] = useState(false);

  // Refs for file inputs
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const siteLogoInputRef = useRef(null);
  const faviconInputRef = useRef(null);
  const mobileLogoInputRef = useRef(null);

  const { t } = useTranslation();

  // Helper to toggle specific loading state
  const setSpecificLoading = (key, value) => {
    setImageLoading(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (file, type) => {
    setSpecificLoading(type, true);
    const formData = new FormData();
    formData.append("post_img", file);
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
        formData
      );
      if (response.url) {
        toast({ title: "Image uploaded successfully", status: "success", duration: 2000, isClosable: true });
        setSpecificLoading(type, false);
        return response.url;
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({ title: "Error uploading image", status: "error", duration: 2000, isClosable: true });
      setSpecificLoading(type, false);
      return null;
    }
  };

  // --- Handlers ---

  const handleCarouselUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const newUrl = await handleImageUpload(file, "carousel");
    if (newUrl) {
      setLogoBannerData(prev => ({
        ...prev,
        carousels: [...(prev.carousels || []), newUrl]
      }));
    }
  };

  const handleRemovePoster = (index) => {
    const updatedCarousels = [...logoBannerData.carousels];
    updatedCarousels.splice(index, 1);
    setLogoBannerData({ ...logoBannerData, carousels: updatedCarousels });
  };

  const handleLogoUpload = async (event, key, loadingKey) => {
    const file = event.target.files[0];
    if (!file) return;
    const newUrl = await handleImageUpload(file, loadingKey);
    if (newUrl) {
      setLogoBannerData(prev => ({ ...prev, [key]: newUrl }));
    }
  };

  const handleRemoveLogo = (key) => {
    setLogoBannerData(prev => ({ ...prev, [key]: "" }));
  };

  const handleChange = (e) => {
    setLogoBannerData({ ...logoBannerData, marque: e.target.value });
  };

  const getSocailData = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/setting/get-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await fetchGetRequest(url);
      setLogoBannerData(response.data);
      setIsSignupEnabled(response?.data?.is_signup_enabled);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdateLoading(true);
    const payload = { ...logoBannerData, is_signup_enabled: isSignupEnabled };
    let url = `${import.meta.env.VITE_API_URL}/api/setting/update-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await sendPatchRequest(url, payload);
      setLogoBannerData(response.data);
      setIsSignupEnabled(response?.data?.is_signup_enabled);
      toast({ description: `Updated Successfully`, status: "success", duration: 4000, position: "top", isClosable: true });
      getSocailData();
      setUpdateLoading(false);
    } catch (error) {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    getSocailData();
  }, []);

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === 'owneradmin';
  const permissionDetails = user?.user?.permissions;
  let hasPermission = checkPermission(permissionDetails, "logoBannerManage");
  let check = !isOwnerAdmin ? hasPermission : true;

  // Reusable Branding Card Component
  const BrandingCard = ({ title, icon: Icon, imageSrc, onUpload, onRemove, isLoading, inputRef, colorClass }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon className={`${colorClass} text-xl`} />
        </div>
        <h3 className="font-bold text-gray-800 text-sm md:text-base">{t(title)}</h3>
      </div>

      <div className="p-6 flex-1 flex flex-col items-center justify-center">
        <div className="w-full h-40 bg-gray-50 rounded-xl border border-gray-200 border-dashed flex items-center justify-center relative mb-4 group overflow-hidden">
          {imageSrc ? (
            <img src={imageSrc} alt={title} className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <span className="text-gray-400 text-sm">{t('No Image Uploaded')}</span>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <LoadingSpinner size="md" color="blue.500" thickness="3px" />
            </div>
          )}
        </div>

        {check && (
          <div className="flex gap-2 w-full">
            <input type="file" ref={inputRef} onChange={onUpload} className="hidden" accept="image/*" />
            <button
              onClick={() => inputRef.current.click()}
              className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <FaCloudUploadAlt /> {imageSrc ? t('Change') : t('Upload')}
            </button>

            {imageSrc && (
              <button
                onClick={onRemove}
                className="py-2 px-3 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center"
              >
                <MdDelete className="text-lg" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-32">
      <div className="w-full space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('Logo & Banner Settings')}</h1>
            <p className="text-gray-500 mt-2 text-sm max-w-2xl">{t('Customize your platform\'s visual identity. Manage banners, logos, and global display settings from a single command center.')}</p>
          </div>

          {check && (
            <button
              onClick={handleUpdate}
              disabled={updateLoading}
              style={{ backgroundColor: bg }}
              className="px-8 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {updateLoading ? <LoadingSpinner size="sm" color="white" thickness="2px" /> : t('Save Changes')}
            </button>
          )}
        </div>

        {/* SECTION 1: PROMOTION POSTERS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaImages className="text-blue-600" />
              {t('Promotion Posters')}
            </h2>
            {check && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
              >
                <LuImport /> {t('Add New Poster')}
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleCarouselUpload}
              accept="image/*"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {logoBannerData?.carousels?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {logoBannerData.carousels.map((img, index) => (
                  <div key={index} className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <img src={img} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                    {check && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                        <button
                          onClick={() => handleRemovePoster(index)}
                          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all"
                          title="Remove Poster"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Upload Placeholder Card */}
                {check && (
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
                  >
                    {imageLoading.carousel ? (
                      <LoadingSpinner size="md" color="blue.500" />
                    ) : (
                      <>
                        <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform mb-3">
                          <FaCloudUploadAlt className="text-gray-400 group-hover:text-blue-500 text-xl" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600">{t('Upload Poster')}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <FaImages className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">{t('No Posters Added')}</h3>
                <p className="text-gray-500 text-sm mt-1 mb-6">{t('Upload high-quality banners to showcase promotions.')}</p>
                {check && (
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {t('Upload First Poster')}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: BRAND ASSETS */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-t border-gray-200 pt-8">
            <MdBrandingWatermark className="text-purple-600" />
            {t('Brand Identity')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <BrandingCard
              title="Admin Logo"
              icon={MdAdminPanelSettings}
              colorClass="text-purple-600"
              imageSrc={logoBannerData?.logo}
              inputRef={logoInputRef}
              isLoading={imageLoading.logo}
              onUpload={(e) => handleLogoUpload(e, 'logo', 'logo')}
              onRemove={() => handleRemoveLogo('logo')}
            />
            <BrandingCard
              title="Website Logo"
              icon={FaGlobe}
              colorClass="text-blue-600"
              imageSrc={logoBannerData?.site_logo}
              inputRef={siteLogoInputRef}
              isLoading={imageLoading.site_logo}
              onUpload={(e) => handleLogoUpload(e, 'site_logo', 'site_logo')}
              onRemove={() => handleRemoveLogo('site_logo')}
            />
            <BrandingCard
              title="Website Favicon"
              icon={MdBrandingWatermark}
              colorClass="text-orange-500"
              imageSrc={logoBannerData?.site_fav_icon}
              inputRef={faviconInputRef}
              isLoading={imageLoading.site_fav_icon}
              onUpload={(e) => handleLogoUpload(e, 'site_fav_icon', 'site_fav_icon')}
              onRemove={() => handleRemoveLogo('site_fav_icon')}
            />
            <BrandingCard
              title="Mobile App Logo"
              icon={FaMobileAlt}
              colorClass="text-indigo-600"
              imageSrc={logoBannerData?.site_logo_mobile}
              inputRef={mobileLogoInputRef}
              isLoading={imageLoading.site_logo_mobile}
              onUpload={(e) => handleLogoUpload(e, 'site_logo_mobile', 'site_logo_mobile')}
              onRemove={() => handleRemoveLogo('site_logo_mobile')}
            />
          </div>
        </section>

        {/* SECTION 3: CONFIGURATION */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-gray-900">{t('System Preferences')}</h3>
            <p className="text-sm text-gray-500 mt-2">{t('Manage global settings for user access and site-wide announcements.')}</p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            {/* Signup Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{t('New User Registration')}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('Control whether new users can sign up.')}</p>
              </div>
              <Switch
                size="lg"
                isChecked={isSignupEnabled}
                onChange={() => setIsSignupEnabled(!isSignupEnabled)}
                colorScheme="green"
              />
            </div>

            {/* Marquee Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t('Global Marquee Text')}</label>
              <textarea
                rows={2}
                value={logoBannerData?.marque || ""}
                onChange={handleChange}
                placeholder="Enter the scrolling text announcement here..."
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-4 transition-all resize-none"
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default LogoBanner;