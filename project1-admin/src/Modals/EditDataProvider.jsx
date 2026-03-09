import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Stack
} from '@chakra-ui/react';
import { sendPatchRequest } from '../api/api';

const EditDataProvider = ({ item, onUpdate, onClose }) => {
  const [editedItem, setEditedItem] = useState(item);
  const toast = useToast();

  const handleUpdate = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/provider-information/update-provider-information/${editedItem._id}`;
      const response = await sendPatchRequest(url, editedItem);
      onUpdate(response.data);
      toast({
        description: 'Provider updated successfully.',
        status: 'success',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        description: `${error?.response?.data?.message || error.message}`,
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setEditedItem((prevItem) => ({ ...prevItem, status: e.target.checked }));
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Provider</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl id="provider_name" isRequired>
              <FormLabel>Provider Name</FormLabel>
              <Input
                name="provider_name"
                value={editedItem.provider_name || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="agent_code" isRequired>
              <FormLabel>Agent Code</FormLabel>
              <Input
                name="agent_code"
                value={editedItem.agent_code || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="api_token" isRequired>
              <FormLabel>API Token</FormLabel>
              <Input
                name="api_token"
                value={editedItem.api_token || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="callback_token" isRequired>
              <FormLabel>Callback Token</FormLabel>
              <Input
                name="callback_token"
                value={editedItem.callback_token || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="secret_key" isRequired>
              <FormLabel>Secret Key</FormLabel>
              <Input
                name="secret_key"
                value={editedItem.secret_key || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="currency" isRequired>
              <FormLabel>Currency</FormLabel>
              <Input
                name="currency"
                value={editedItem.currency || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="percent" isRequired>
              <FormLabel>Percent</FormLabel>
              <Input
                name="percent"
                type="number"
                value={editedItem.percent || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="max_limit" isRequired>
              <FormLabel>Max Limit</FormLabel>
              <Input
                name="max_limit"
                type="number"
                value={editedItem.max_limit || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="min_limit" isRequired>
              <FormLabel>Min Limit</FormLabel>
              <Input
                name="min_limit"
                type="number"
                value={editedItem.min_limit || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="max_per_match" isRequired>
              <FormLabel>Max Per Match</FormLabel>
              <Input
                name="max_per_match"
                type="number"
                value={editedItem.max_per_match || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="casino_table_limit" isRequired>
              <FormLabel>Casino Table Limit</FormLabel>
              <Input
                name="casino_table_limit"
                type="number"
                value={editedItem.casino_table_limit || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="provider_api_url" isRequired>
              <FormLabel>Provider API URL</FormLabel>
              <Input
                name="provider_api_url"
                value={editedItem.provider_api_url || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="provider_callback_url" isRequired>
              <FormLabel>Provider Callback URL</FormLabel>
              <Input
                name="provider_callback_url"
                value={editedItem.provider_callback_url || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="status" display="flex" alignItems="center" isRequired>
              <FormLabel>Status</FormLabel>
              <Switch
                name="status"
                isChecked={editedItem.status}
                onChange={handleStatusChange}
              />
            </FormControl>
            <FormControl id="image_url" isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image_url"
                value={editedItem.image_url || ''}
                onChange={handleChange}
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditDataProvider;
