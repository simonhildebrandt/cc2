import { useState, useEffect, useContext } from "react";
import {
  Flex,
  Dialog,
  Portal,
  Button,
  CloseButton,
  FileUpload,
  Icon,
  Image,
  createListCollection,
} from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";

import { AuthContext } from "../services/auth-provider";
import ContentEditor from "./content-editor";

export default function ({
  clockId,
  dialogOpen,
  setDialogOpen,
  uploadedFile,
  uploadAccepted,
  createImage,
  updateImage,
  setImageContent,
  imageContent,
  image,
  Select,
}) {
  const { pb } = useContext(AuthContext);
  const [clock, setClock] = useState(null);

  function getClock() {
    pb.collection("clocks")
      .getOne(clockId)
      .then((data) => {
        setClock(data);
      });
  }

  useEffect(() => {
    const unsubPromise = pb.collection("clocks").subscribe(clockId, getClock);
    getClock();

    return () => unsubPromise.then((unsub) => unsub());
  }, []);

  if (clock == null) return;

  const { image: filename, content } = image || {};
  const thumb = "0x128";
  const url = pb.files.getURL(image, filename);

  return (
    <Dialog.Root
      lazyMount
      open={dialogOpen}
      onOpenChange={(e) => setDialogOpen(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {image ? "Update Image" : "Add Image"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {image ? (
                <Flex>
                  <Image
                    src={url}
                    width="100%"
                    height="100%"
                    maxHeight="400px"
                    objectFit="contain"
                    objectPosition="50% 50%"
                  />
                </Flex>
              ) : (
                <Flex width="100%" direction="column" align="center">
                  <FileUpload.Root
                    capture="environment"
                    alignItems="stretch"
                    position="relative"
                    accept={["image/*"]}
                    onFileAccept={uploadAccepted}
                  >
                    <FileUpload.HiddenInput />
                    <FileUpload.ItemGroup asChild>
                      <Flex
                        width="100%"
                        minHeight="400px"
                        maxHeight="600px"
                        align="center"
                        justify="center"
                      >
                        <FileUpload.Context>
                          {({ acceptedFiles }) =>
                            acceptedFiles.map((file) => (
                              <FileUpload.Item
                                key={file.name}
                                file={file}
                                w="100%"
                                h="100%"
                              >
                                <FileUpload.ItemPreviewImage />
                              </FileUpload.Item>
                            ))
                          }
                        </FileUpload.Context>
                      </Flex>
                    </FileUpload.ItemGroup>
                    <FileUpload.Dropzone
                      position="absolute"
                      width="100%"
                      height="100%"
                      bgColor="#0006"
                    >
                      <Flex
                        direction="column"
                        gap={3}
                        bgColor="#000A"
                        p={4}
                        align="center"
                      >
                        <Icon size="md" color="fg.muted">
                          <LuUpload />
                        </Icon>
                        <FileUpload.DropzoneContent>
                          <Flex>Drag and drop files here</Flex>
                          <Flex color="fg.muted">.png, .jpg up to 5MB</Flex>
                        </FileUpload.DropzoneContent>
                      </Flex>
                    </FileUpload.Dropzone>
                  </FileUpload.Root>
                </Flex>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Flex flexGrow={1}>
                <ContentEditor
                  clock={clock}
                  imageContent={imageContent}
                  setImageContent={setImageContent}
                />
              </Flex>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              {image ? (
                <Button onClick={updateImage}>Update</Button>
              ) : (
                <Button disabled={uploadedFile == null} onClick={createImage}>
                  Save
                </Button>
              )}
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
