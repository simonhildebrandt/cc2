import { useContext, useState, useEffect } from "react";
import {
  Flex,
  Heading,
  EmptyState,
  VStack,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { TbClockHour2, TbClockEdit } from "react-icons/tb";
import { useNavigate } from "react-router";
import { FaEye } from "react-icons/fa";

import Layout from "../components/layout";
import { AuthContext } from "../services/auth-provider";
import DeleteControl from "../components/delete-control";

function ImageList({ clockId }) {
  const [images, setImages] = useState(null);

  function getImages() {
    pb.collection("images")
      .getFullList({
        sort: "-created", // Filter for clock
        filter: `clock="${clockId}"`,
      })
      .then(setImages);
  }

  useEffect(getImages, []);

  const thumb = "0x128";

  if (images == null) return;

  return (
    <Flex flexGrow={1} flexShrink={1} overflow="hidden">
      {images.length == 0 && <Flex color="fg.muted">No images yet</Flex>}
      {images.map((image) => (
        <Image
          key={image.id}
          src={pb.files.getURL(image, image.image, { thumb })}
          height="128px"
          width="128px"
          objectFit="contain"
          objectPosition="50% 50%"
        />
      ))}
    </Flex>
  );
}

const ClocksPage = () => {
  const [clocks, setClocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, pb } = useContext(AuthContext);

  let navigate = useNavigate();

  function getClocks() {
    pb.collection("clocks")
      .getFullList({
        sort: "-updated",
      })
      .then((data) => {
        setClocks(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    const unsubPromise = pb.collection("clocks").subscribe("*", getClocks);
    getClocks();
    return () => unsubPromise.then((unsub) => unsub());
  }, []);

  async function createClock() {
    const record = await pb.collection("clocks").create({
      name: `Clock ${new Date().toLocaleTimeString()}`,
      owner: user.id,
      granularity_minutes: 10,
      mode: "single",
      range: "12",
    });
  }

  function showClock(e, clockId) {
    e.stopPropagation();
    navigate(`/clocks/${clockId}/show`);
  }

  return (
    <Layout authed={true}>
      <Flex width="100%" height="100%" flexDirection="column">
        <Heading>Your Clocks</Heading>
        {clocks.length === 0 ? (
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
                  <TbClockHour2 />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>No clocks created yet</EmptyState.Title>
                  <EmptyState.Description>
                    Click the button below to create your first clock.
                  </EmptyState.Description>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          </Flex>
        ) : (
          <Flex direction="column" gap={4} mt={4} borderRadius={8}>
            {clocks.map((clock) => (
              <Flex
                key={clock.id}
                onClick={() => navigate(`/clocks/${clock.id}`)}
                bgColor="bg.emphasized"
                px={6}
                py={4}
                direction="column"
                cursor="pointer"
                gap={2}
              >
                <Flex>
                  <Flex justify="space-between" flexGrow={1} align="flex-end">
                    <Heading>{clock.name}</Heading>
                    <Flex color="fg.muted" align="center" gap={4}>
                      <IconButton
                        size="md"
                        variant="ghost"
                        onClick={(e) => showClock(e, clock.id)}
                      >
                        <FaEye />
                      </IconButton>
                      <Flex>
                        {clock.granularity_minutes}min - {clock.range} hour -{" "}
                        {clock.mode}
                      </Flex>
                      <DeleteControl />
                    </Flex>
                  </Flex>
                </Flex>
                <ImageList clockId={clock.id} />
              </Flex>
            ))}
          </Flex>
        )}

        <Flex position="fixed" bottom={4} right={4}>
          <IconButton
            rounded="full"
            aria-label="Create Clock"
            onClick={createClock}
            size="xl"
          >
            <TbClockEdit size="100px" />
          </IconButton>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default ClocksPage;
