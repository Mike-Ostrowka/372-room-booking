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
import { MdEdit, MdDelete } from "react-icons/md";
import { useState } from "react";
import LostItemEditModal from "./LostItemEditModal";

const LostItemsTable = ({ lostItems, setLostItems }: any) => {
  const toast = useToast();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDelete = async (id: any) => {
    try {
      const res = await fetch(`/lost-and-found/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 200) {
        const lostItemsRes = await res.json();
        setLostItems(lostItemsRes);
        toast({
          title: "Lost Item Report Deleted",
          description: "You have deleted a lost item report",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to Delete Lost Item Report",
          description: "You have deleted a lost item report",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TableContainer width="100%">
      <Table variant="striped">
        <TableCaption>Your Lost Item Reports</TableCaption>
        <Thead>
          <Tr>
            <Th>Item Name</Th>
            <Th>Item Description</Th>
            <Th>Item Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {lostItems.map((i: any) => (
            <Tr>
              <Td>{i.item_name}</Td>
              <Td>{i.item_description}</Td>
              <Td>{i.item_found ? "Found" : "Not Found"}</Td>
              <Td>
                <Button
                  onClick={() => {
                    setOpenEditDialog(true);
                    setSelectedItem(i);
                  }}
                >
                  <MdEdit />
                </Button>
              </Td>
              <Td>
                <Button onClick={() => handleDelete(i.id)}>
                  <MdDelete />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {openEditDialog && (
        <LostItemEditModal
          setLostItems={setLostItems}
          lostItemData={selectedItem}
          setOpenEditDialog={setOpenEditDialog}
          openEditDialog={openEditDialog}
        />
      )}
    </TableContainer>
  );
};

export default LostItemsTable;
