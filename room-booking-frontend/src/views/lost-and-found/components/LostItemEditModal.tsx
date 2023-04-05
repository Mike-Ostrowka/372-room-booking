import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormHelperText,
  Stack,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";

import { useFormik } from "formik";
import * as Yup from "yup";

const LostItemEditModal = ({
  openEditDialog,
  setOpenEditDialog,
  lostItemData,
  setLostItems,
}: any) => {
  const onClose = () => {
    setOpenEditDialog(false);
  };
  const toast = useToast();

  const validationSchema = Yup.object().shape({
    item_name: Yup.string().required("Lost Item Name is Required"),
    item_description: Yup.string().required(
      "Lost Item Description is Required"
    ),
  });
  const formik = useFormik({
    initialValues: {
      item_name: lostItemData.item_name,
      item_description: lostItemData.item_description,
    },
    onSubmit: async (values: any, { setSubmitting }: any) => {
      const data = {
        item_name: values.item_name,
        item_description: values.item_description,
      };
      try {
        const response = await fetch(
          `http://localhost:8080/lost-and-found/${lostItemData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
          }
        );

        if (response.status === 200) {
          const lostItemsRes = await response.json();
          setLostItems(lostItemsRes);
          toast({
            title: "Lost Item Report Changes Saved",
            description: `You have successfully updated lost item report`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Lost Item Report Changes Failed",
            description:
              "The system could not edit a lost item report. Try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        setOpenEditDialog(false);
        setSubmitting(false);
      } catch (e) {
        console.log(e);
        setSubmitting(false);
      }
      formik.resetForm();
    },
    validationSchema: validationSchema,
  });

  return (
    <Modal isOpen={openEditDialog} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Lost Item Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={5} alignItems="center">
                <Stack width="100%" spacing={4}>
                  <Input
                    placeholder="Item Name"
                    size="lg"
                    name="item_name"
                    value={formik.values.item_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.errors.item_name &&
                      formik.touched.item_name &&
                      "red"
                    }
                  />
                  {formik.errors.item_name && formik.touched.item_name && (
                    <FormHelperText>
                      {formik.errors.item_name.toString()}
                    </FormHelperText>
                  )}
                  <Input
                    placeholder="Item Description"
                    size="lg"
                    name="item_description"
                    value={formik.values.item_description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.errors.item_description &&
                      formik.touched.item_description &&
                      "red"
                    }
                  />
                  {formik.errors.item_description &&
                    formik.touched.item_description && (
                      <FormHelperText>
                        {formik.errors.item_description.toString()}
                      </FormHelperText>
                    )}
                </Stack>
                <Stack width="50%">
                  <Button
                    variant="solid"
                    colorScheme="red"
                    type="submit"
                    isLoading={formik.isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Stack>
              </Stack>
            </form>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LostItemEditModal;
