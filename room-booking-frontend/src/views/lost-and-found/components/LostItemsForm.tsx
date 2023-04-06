import {
  Stack,
  Input,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Button,
  FormHelperText,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import { UserContext } from "contexts/UserContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const LostItemsForm = ({ setLostItems }: any) => {
  const toast = useToast();
  const { loggedInUser } = useContext(UserContext);
  const validationSchema = Yup.object().shape({
    item_name: Yup.string().required("Item Name is Required"),
    item_description: Yup.string().required("Item Description is Required"),
  });
  const formik = useFormik({
    initialValues: {
      item_name: "",
      item_description: "",
    },
    onSubmit: async (values: any, { setSubmitting }: any) => {
      const data = {
        item_name: values.item_name,
        item_description: values.item_description,
        user_id: loggedInUser.u_id,
      };
      try {
        const response = await fetch("/lost-and-found", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        });
        if (response.status === 200) {
          const lostItemsRes = await response.json();
          setLostItems(lostItemsRes);
          toast({
            title: "New Lost Item",
            description: "You have successfully created a new lost item report",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Lost Item Report Failed",
            description:
              "The system could not report an item. Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
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
    <Card width="100%">
      <CardHeader>
        <Heading size="md">New Lost Item</Heading>
      </CardHeader>
      <CardBody>
        <FormControl>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={5} alignItems="center">
              <Stack width="100%" spacing={2} direction="row">
                <Stack flex={1}>
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
                    <FormHelperText>{formik.errors.item_name}</FormHelperText>
                  )}
                </Stack>
                <Stack flex={1}>
                  <Input
                    placeholder="Description of Item"
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
                        {formik.errors.item_description}
                      </FormHelperText>
                    )}
                </Stack>
              </Stack>
              <Stack width="50%">
                <Button
                  variant="solid"
                  colorScheme="red"
                  type="submit"
                  isLoading={formik.isSubmitting}
                >
                  Create Report
                </Button>
              </Stack>
            </Stack>
          </form>
        </FormControl>
      </CardBody>
    </Card>
  );
};
export default LostItemsForm;
