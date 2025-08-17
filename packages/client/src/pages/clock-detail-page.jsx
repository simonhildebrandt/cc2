import { useState } from "react";
import { useParams } from "react-router";
import { Flex, IconButton } from "@chakra-ui/react";
import { LuImagePlus } from "react-icons/lu";

import Layout from "../components/layout";
import ClockSettings from "../components/clock-settings";
import Images from "../components/images";
import ImageDialog from "../components/image-dialog";

export default function () {
  let { id } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageContent, setImageContent] = useState("XX:XX");

  async function createImage() {
    const record = await pb.collection("images").create({
      clock: id,
      image: uploadedFile,
      content: imageContent,
    });
    setDialogOpen(false);
  }

  async function updateImage() {
    await pb
      .collection("images")
      .update(selectedImage.id, { content: imageContent });
    setImageContent("XX:XX");
    handleDialogOpen(false);
  }

  function uploadAccepted({ files }) {
    if (files.length == 1) {
      setUploadedFile(files[0]);
    }
  }

  function handleImageClick(image) {
    setSelectedImage(image);
    setImageContent(image.content);
    setDialogOpen(true);
  }

  function handleDialogOpen(status) {
    if (status == false) setSelectedImage(null);
    setDialogOpen(status);
  }

  return (
    <Layout authed={true}>
      <ImageDialog
        clockId={id}
        dialogOpen={dialogOpen}
        setDialogOpen={handleDialogOpen}
        uploadedFile={uploadedFile}
        uploadAccepted={uploadAccepted}
        createImage={createImage}
        updateImage={updateImage}
        imageContent={imageContent}
        setImageContent={setImageContent}
        image={selectedImage}
      />

      <Flex width="100%" justifyContent="space-between" align="center">
        <ClockSettings clockId={id} />
      </Flex>
      <Flex flexGrow={1}>
        <Images clockId={id} onClick={handleImageClick} />
      </Flex>

      <Flex position="fixed" bottom={4} right={4}>
        <IconButton
          rounded="full"
          aria-label="Create Clock"
          onClick={() => setDialogOpen(true)}
          size="xl"
        >
          <LuImagePlus size="100px" />
        </IconButton>
      </Flex>
    </Layout>
  );
}
