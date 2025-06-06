import React, { useEffect, useState } from "react";
import { ProductTable } from "../../components/table/tabel";
import { DialogCustom } from "../../components/popup/popup";
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useEditProductMutation,
} from "../../data-access/api/Products/products";
import {
  Button,
  DialogFooter,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
// import { Input } from "../../components/input/input";
import { FileInput } from "../../components/file-input/file-input";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@material-tailwind/react";
import imageCompression from "browser-image-compression";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

export const Products = () => {
  const [image, setImage] = React.useState("");

  const TABLE_HEAD = [
    "Product image",
    "Product name",
    "Product price",
    "",
  ];
  const [addPopup, setAddPopup] = React.useState(false);
  const [deletePopup, setDeletePopup] = React.useState(false);

  const handleOpen = () => {
    setAddPopup(!addPopup);
    reset();
  };

  const { data } = useGetProductsQuery({});

  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (data?.data?.cars) {
      setProducts(data?.data?.cars);
    }
  }, [data]);

  const [addProduct, { isLoading: isLoadingAddProduct }] =
    useAddProductMutation({});
  const [deleteProduct, { isLoading: isLoadingDeletePopup }] =
    useDeleteProductMutation({});
  const [editProduct] = useEditProductMutation({});

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({});

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    } catch (error) {
      console.error(error);
    }
  };

  const [productId, setProductId] = React.useState("");
  const handelSetProductId = (id) => {
    setProductId(id);
    setDeletePopup(!deletePopup);
  };
  const handelCloseDeletePopup = (id) => {
    setProductId("");
    setDeletePopup(!deletePopup);
  };

  const [edit, setEdit] = useState("");
  const handleEditProduct = (id) => {
    const productData = products.find((item) => item.id === id);
    setAddPopup(!addPopup);
    setEdit(productData);
  };

  const onSubmit = async (data) => {
    if (edit) {
      const payload = {
        name: data.name,
        price: data.price,
        description: data.description,
        url1: data.url1,
        url2: data.url2,
        url3: data.url3,
        url4: data.url4,
        url5: data.url5,
      };
      await editProduct({ payload, id: edit?.id });
      reset();
      setImage("");
      setAddPopup(false);
    } else {
      const payload = {
        name: data.name,
        price: data.price,
        description: data.description,
        url1: data.url1,
        url2: data.url2,
        url3: data.url3,
        url4: data.url4,
        url5: data.url5,
      };
      await addProduct(payload);
      reset();
      setImage("");
      setAddPopup(false);
    }
  };

  return (
    <div className="container mx-auto my-[10px]">
      <ProductTable
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={products}
        handleOpenPopup={handleOpen}
        handelSetProductId={handelSetProductId}
        handleEditProduct={handleEditProduct}
      />
      <DialogCustom
        header={"Delete Product"}
        open={deletePopup}
        handleOpen={handelSetProductId}
      >
        <Typography> Are you sure! </Typography>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handelCloseDeletePopup}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            onClick={async () => {
              await deleteProduct({ id: productId });
              setDeletePopup(!deletePopup);
            }}
            disabled={isLoadingDeletePopup}
            type="submit"
            color="green"
          >
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogCustom>
      <DialogCustom
        header={"New Product"}
        open={addPopup}
        handleOpen={handleOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12">
              <Controller
                name="name"
                control={control}
                defaultValue={edit ? edit?.name : ""}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={"Product Name"}
                    type={"text"}
                    className={"name"}
                  />
                )}
              />
            </div>


            <div className="col-span-12">
              <Controller
                name="price"
                control={control}
                defaultValue={edit ? edit?.price : ""}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={"Product Price"}
                    type={"text"}
                    className={"price"}
                  />
                )}
              />
            </div>


            <div className="col-span-12">
              <Controller
                name="description"
                defaultValue={edit ? edit?.description : ""}
                control={control}
                render={({ field }) => <ReactQuill {...field} />}
              />
            </div>

            <div className="col-span-12">
              <Controller
                name="url1"
                control={control}
                defaultValue={edit ? edit?.url1 : ""}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={"Product image"}
                    type={"text"}
                    className={"name"}
                  />
                )}
              />
            </div>

            <div className="col-span-12">
              <Controller
                name="url2"
                control={control}
                defaultValue={edit ? edit?.url2 : ""}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={"Product image"}
                    type={"text"}
                    className={"name"}
                  />
                )}
              />
            </div>

            <div className="col-span-12">
              <Controller
                name="url3"
                control={control}
                defaultValue={edit ? edit?.url3 : ""}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={"Product image"}
                    type={"text"}
                    className={"name"}
                  />
                )}
              />
            </div>

            <div className="col-span-12">
              <Controller
                name="url4"
                control={control}
                defaultValue={edit ? edit?.url4 : ""}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={"Product image"}
                    type={"text"}
                    className={"name"}
                  />
                )}
              />
            </div>

            <div className="col-span-12">
              <Controller
                name="url5"
                control={control}
                defaultValue={edit ? edit?.url5 : ""}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={"Product image"}
                    type={"text"}
                    className={"name"}
                  />
                )}
              />
            </div>

            {/* <div className="col-span-12">
              <Input
                label={"Product image"}
                type={"file"}
                onChange={handleImageUpload}
                accept="image/*"
                className={"name"}
              />
            </div> */}
            {image ? (
              <div className="col-span-12">
                <img
                  src={image}
                  alt="product-image"
                  width={"100%"}
                  height={"200px"}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              disabled={isLoadingAddProduct}
              type="submit"
              color="green"
            >
              <span>Submit</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogCustom>
    </div>
  );
};
