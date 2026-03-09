import React, { useState } from 'react';
import { 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay, 
  useToast, 
  Stack 
} from '@chakra-ui/react';
import { sendPostRequest } from '../api/api';

const AddDataProvider = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({});
  const toast = useToast();

  const handleAdd = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/provider-information/add-provider-information`;
      const response = await sendPostRequest(url, newItem);
      onAdd(response.data);
      toast({
        description: 'Provider added successfully.',
        status: 'success',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
      setNewItem({});
      setIsOpen(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message || error.message}`,
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} colorScheme="blue" mb={4}>
        Add New Provider
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Provider</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl id="provider_name" isRequired>
                <FormLabel>Provider Name</FormLabel>
                <Input
                  name="provider_name"
                  value={newItem.provider_name || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="agent_code" isRequired>
                <FormLabel>Agent Code</FormLabel>
                <Input
                  name="agent_code"
                  value={newItem.agent_code || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="api_token" isRequired>
                <FormLabel>API Token</FormLabel>
                <Input
                  name="api_token"
                  value={newItem.api_token || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="callback_token" isRequired>
                <FormLabel>Callback Token</FormLabel>
                <Input
                  name="callback_token"
                  value={newItem.callback_token || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="secret_key" isRequired>
                <FormLabel>Secret Key</FormLabel>
                <Input
                  name="secret_key"
                  value={newItem.secret_key || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="currency" isRequired>
                <FormLabel>Currency</FormLabel>
                <Input
                  name="currency"
                  value={newItem.currency || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="percent" isRequired>
                <FormLabel>Percent</FormLabel>
                <Input
                  name="percent"
                  type="number"
                  value={newItem.percent || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="max_limit" isRequired>
                <FormLabel>Max Limit</FormLabel>
                <Input
                  name="max_limit"
                  type="number"
                  value={newItem.max_limit || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="min_limit" isRequired>
                <FormLabel>Min Limit</FormLabel>
                <Input
                  name="min_limit"
                  type="number"
                  value={newItem.min_limit || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="max_per_match" isRequired>
                <FormLabel>Max Per Match</FormLabel>
                <Input
                  name="max_per_match"
                  type="number"
                  value={newItem.max_per_match || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="casino_table_limit" isRequired>
                <FormLabel>Casino Table Limit</FormLabel>
                <Input
                  name="casino_table_limit"
                  type="number"
                  value={newItem.casino_table_limit || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="provider_api_url" isRequired>
                <FormLabel>Provider API URL</FormLabel>
                <Input
                  name="provider_api_url"
                  value={newItem.provider_api_url || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="provider_callback_url" isRequired>
                <FormLabel>Provider Callback URL</FormLabel>
                <Input
                  name="provider_callback_url"
                  value={newItem.provider_callback_url || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="status" isRequired>
                <FormLabel>Status</FormLabel>
                <Input
                  name="status"
                  value={newItem.status || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="image_url" isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="image_url"
                  value={newItem.image_url || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAdd}>
              Add
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddDataProvider;
