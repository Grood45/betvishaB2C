import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Text,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  Progress,
  Switch,
  Badge,
} from "@chakra-ui/react";
import EditDataProvider from "./EditDataProvider"; // Adjust the import path as needed
import AddDataProvider from "./AddDataProvider"; // Adjust the import path as needed
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import { Provider } from "react-redux";

const DataProvider = () => {
  const [providerInfo, setProviderInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    const fetchProviderInfo = async () => {
      try {
        const url = `${
          import.meta.env.VITE_API_URL
        }/api/provider-information/get-provider-information?site_auth_key=BspAuthKey123`;
        const response = await fetchGetRequest(url);

        if (response.data && response.success) {
          setProviderInfo(response.data);
        } else {
          setError("Failed to retrieve data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderInfo();
  }, []);

  const handleEdit = (provider) => {
    setSelectedProvider(provider);
    setEditModalOpen(true);
  };

  const handleUpdate = (updatedProvider) => {
    setProviderInfo((prevInfo) =>
      prevInfo.map((provider) =>
        provider._id.$oid === updatedProvider._id.$oid
          ? updatedProvider
          : provider
      )
    );
    setEditModalOpen(false);
  };

  const handleAdd = (newProvider) => {
    setProviderInfo((prevInfo) => [...prevInfo, newProvider]);
  };

  const handleClose = () => {
    setEditModalOpen(false);
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  const truncateText = (text, length = 20) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  const handleStatusChange = async (provider) => {
    const updatedStatus = !provider.status;
    try {
      const response = await sendPatchRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/provider-information/update-provider-information-status/${
          provider._id
        }?site_auth_key=BspAuthKey123`,
        {
          id: provider._id,
          status: updatedStatus,
        }
      );

      if (response.data && response.success) {
        setProviderInfo((prevInfo) =>
          prevInfo.map((item) =>
            item._id === provider._id
              ? { ...item, status: updatedStatus }
              : item
          )
        );
      } else {
        setError("Failed to update status");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box p={6} className="bg-gray-100 min-h-screen">
      <div className="flex justify-center w-full mb-6">
        <AddDataProvider onAdd={handleAdd} />
      </div>

      <Box overflowX="auto">
        {loading && (
          <Progress
            w={"100%"}
            size="xs"
            isIndeterminate
            colorScheme="#e91e63"
          />
        )}
        <Table
          variant="striped"
          colorScheme="gray"
          size="md"
          borderWidth="1px"
          borderColor="gray.300"
          borderRadius="md"
          boxShadow="md"
        >
          <Thead>
            <Tr>
              <Th borderColor="gray.300">Provider Name</Th>
              <Th borderColor="gray.300">Agent Code</Th>
              <Th borderColor="gray.300">API Token</Th>
              <Th borderColor="gray.300">Callback Token</Th>
              <Th borderColor="gray.300">Secret Key</Th>
              <Th borderColor="gray.300">Currency</Th>
              <Th borderColor="gray.300">Percent</Th>
              <Th borderColor="gray.300">Manage Status</Th>
              <Th borderColor="gray.300">Max Limit</Th>
              <Th borderColor="gray.300">Min Limit</Th>
              <Th borderColor="gray.300">Max Per Match</Th>
              <Th borderColor="gray.300">Casino Table Limit</Th>
              <Th borderColor="gray.300">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {providerInfo.map((provider) => (
              <Tr key={provider._id.$oid}>
                <Td borderColor="gray.300">{provider.provider_name}</Td>
                <Td borderColor="gray.300">
                  <Tooltip
                    label={provider.agent_code}
                    bg="teal.500"
                    color="white"
                  >
                    <span>{truncateText(provider.agent_code)}</span>
                  </Tooltip>
                </Td>
                <Td borderColor="gray.300">
                  <Tooltip
                    label={provider.api_token}
                    bg="teal.500"
                    color="white"
                  >
                    <span>{truncateText(provider.api_token)}</span>
                  </Tooltip>
                </Td>
                <Td borderColor="gray.300">
                  <Tooltip
                    label={provider.callback_token}
                    bg="teal.500"
                    color="white"
                  >
                    <span>{truncateText(provider.callback_token)}</span>
                  </Tooltip>
                </Td>
                <Td borderColor="gray.300">
                  <Tooltip
                    label={provider.secret_key}
                    bg="teal.500"
                    color="white"
                  >
                    <span>{truncateText(provider.secret_key)}</span>
                  </Tooltip>
                </Td>
                <Td borderColor="gray.300">{provider.currency}</Td>
                <Td borderColor="gray.300">{provider.percent}%</Td>
                <Td borderColor="gray.300">
                  <p className="flex items-center gap-2 ">
                    <Badge
                      style={{
                        backgroundColor: provider.status ? "green" : "red",
                        color: "white",
                      }}
                    >
                      {" "}
                      {provider.status ? "Active" : "Inactive"}{" "}
                    </Badge>
                    <Switch
                      name="status"
                      isChecked={provider.status}
                      onChange={() => handleStatusChange(provider)}
                    />
                  </p>
                </Td>
                <Td borderColor="gray.300">{provider.max_limit}</Td>
                <Td borderColor="gray.300">{provider.min_limit}</Td>
                <Td borderColor="gray.300">{provider.max_per_match}</Td>
                <Td borderColor="gray.300">{provider.casino_table_limit}</Td>

                <Td borderColor="gray.300">
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleEdit(provider)}
                  >
                    Edit
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {isEditModalOpen && selectedProvider && (
        <EditDataProvider
          item={selectedProvider}
          onUpdate={handleUpdate}
          onClose={handleClose}
        />
      )}
    </Box>
  );
};

export default DataProvider;
