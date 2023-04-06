import {
  TableContainer,
  Table,
  Thead,
  TableCaption,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

const LostItemsTable = () => {
  const [lostItems, setLostItems] = useState([]);

  const toast = useToast();

  const toggleItemStatus = async (item: any) => {
    try {
      const data = {
        item_found: !item.item_found,
      };
      const res = await fetch(
        `/lost-and-found/status/${item.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          method: "PUT",
          credentials: "include",
        }
      );
      const lostItemsRes = await res.json();
      setLostItems(lostItemsRes);
      toast({
        title: "Item Status Changed",
        description: `You have changed the status of item ${
          item.item_name
        } to ${!item.item_found ? "Found" : "Not Found"}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const res = await fetch("/lost-and-found", {
          method: "GET",
          credentials: "include",
        });
        const lostItemsRes = await res.json();
        setLostItems(lostItemsRes);
      } catch (e) {
        console.log(e);
      }
    };
    fetchLostItems();
  }, []);

  return (
    <TableContainer>
      <Table variant="striped">
        <TableCaption>All lost items</TableCaption>
        <Thead>
          <Tr>
            <Th>Item Name</Th>
            <Th>Item Description</Th>
            <Th>Date of Report</Th>
            <Th>Item Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {lostItems.map((item: any) => (
            <Tr key={item.id}>
              <Td>{item.item_name}</Td>
              <Td>{item.item_description}</Td>
              <Td>
                {new Date(item.date_created).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Td>
              <Td>{item.item_found ? "Found" : "Not Found"}</Td>
              <Td>
                <Button
                  variant="outline"
                  onClick={() => toggleItemStatus(item)}
                >
                  Toggle Status
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default LostItemsTable;
