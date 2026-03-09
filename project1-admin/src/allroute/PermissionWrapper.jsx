import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const PermissionWrapper = ({ component: Component, permissionName }) => {

const user = useSelector((state) => state.authReducer);
const adminData = user.user || {};

const permissionDetails=user?.user?.permissions


  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const hasPermission = permissionDetails?.find(
    (permission) => permission.name === permissionName
  )?.value;
  
  const toast = useToast();

  if (!isOwnerAdmin && !hasPermission) {
    toast({
      title: 'Permission Denied',
    
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default PermissionWrapper;
