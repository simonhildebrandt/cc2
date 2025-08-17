import { useEffect, useState, useContext } from "react";
import {
  Flex,
  VStack,
  EmptyState,
  IconButton,
  Image as CImage,
} from "@chakra-ui/react";
import { LuImage } from "react-icons/lu";

import { AuthContext } from "../services/auth-provider";
import DeleteControl from "./delete-control";

function Image({ image, mode, onClick }) {
  const { pb } = useContext(AuthContext);

  const { id, image: filename, content } = image;
  const split = mode == "split";
  const thumb = split ? "0x128" : "256x0";
  const url = pb.files.getURL(image, filename, { thumb });

  const [hour, minute] = content.split(":");

  function onDelete() {
    pb.collection("images").delete(id);
  }

  const error = split
    ? hour != "XX" && minute != "XX"
    : hour == "XX" || minute == "XX";

  return (
    <Flex
      border="1px solid"
      borderColor="bg.emphasized"
      borderRadius={8}
      flexDirection="column"
      alignItems="center"
      gap={2}
      overflow="hidden"
      cursor="pointer"
      onClick={() => onClick(image)}
    >
      <CImage
        width={split ? "128px" : "256px"}
        height="128px"
        src={url}
        objectFit="contain"
        objectPosition="50% 50%"
        m={4}
      />
      <Flex
        py={2}
        pr={2}
        pl={4}
        bgColor={error ? "orange.900" : "bg.muted"}
        width="100%"
        justify="space-between"
        align="center"
      >
        {split ? (
          <Flex>
            {hour == "XX" ? (
              <Flex color="fg.subtle">HH</Flex>
            ) : (
              <Flex>{hour}</Flex>
            )}
            :
            {minute == "XX" ? (
              <Flex color="fg.subtle">MM</Flex>
            ) : (
              <Flex>{minute}</Flex>
            )}
          </Flex>
        ) : (
          <Flex>{content}</Flex>
        )}
        <DeleteControl onDelete={onDelete} />
      </Flex>
    </Flex>
  );
}

export default function ({ clockId, onClick }) {
  const { pb } = useContext(AuthContext);
  const [images, setImages] = useState(null);
  const [clock, setClock] = useState(null);

  function getImages() {
    pb.collection("images")
      .getFullList({
        sort: "-created", // Filter for clock
        filter: `clock="${clockId}"`,
      })
      .then(setImages);
  }

  function getClock() {
    pb.collection("clocks").getOne(clockId).then(setClock);
  }

  useEffect(() => {
    const unsubPromise1 = pb.collection("images").subscribe("*", getImages);
    const unsubPromise2 = pb.collection("clocks").subscribe(clockId, getClock);
    getImages();
    getClock();

    return () => {
      Promise.all([unsubPromise1, unsubPromise2]).then((unsubs) =>
        unsubs.map((u) => u())
      );
    };
  }, []);

  if (images == null || clock == null) return;

  const { mode } = clock;

  return (
    <Flex
      width="100%"
      flexGrow={1}
      my={4}
      p={4}
      bgColor="bg.subtle"
      borderRadius={8}
    >
      {images.length === 0 ? (
        <Flex
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuImage />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title>No images uploaded yet</EmptyState.Title>
                <EmptyState.Description>
                  Click the button below to upload your first image.
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        </Flex>
      ) : (
        <Flex flexWrap="wrap" gap={4} alignItems="flex-start">
          {images.map((image) => (
            <Image key={image.id} image={image} mode={mode} onClick={onClick} />
          ))}
        </Flex>
      )}
    </Flex>
  );
}
