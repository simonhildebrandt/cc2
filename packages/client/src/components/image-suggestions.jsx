import { useContext, useEffect, useState } from "react";
import { Flex, Alert, Button } from "@chakra-ui/react";

import { AuthContext } from "../services/auth-provider";

function* generateImageContents(clock) {
  const [startHour, endHour] = clock.range == "12" ? [1, 12] : [0, 23];
  for (let hour = startHour; hour <= endHour; hour++) {
    if (clock.mode == "split") {
      yield `${String(hour).padStart(2, "0")}:XX`;
    }

    for (let minute = 0; minute < 60; minute += clock.granularity_minutes) {
      if (clock.mode == "single") {
        yield `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      } else {
        yield `${String(hour).padStart(2, "0")}:XX`;
      }
    }
  }
}

export default function ({ id, setContent }) {
  const { pb } = useContext(AuthContext);
  const [images, setImages] = useState(null);
  const [clock, setClock] = useState(null);

  function getImages() {
    pb.collection("images")
      .getFullList({
        sort: "-created", // Filter for clock
        filter: `clock="${id}"`,
      })
      .then(setImages);
  }

  function getClock() {
    pb.collection("clocks").getOne(id).then(setClock);
  }

  useEffect(() => {
    const unsubPromise1 = pb.collection("images").subscribe("*", getImages);
    const unsubPromise2 = pb.collection("clocks").subscribe(id, getClock);
    getImages();
    getClock();

    return () => {
      Promise.all([unsubPromise1, unsubPromise2]).then((unsubs) =>
        unsubs.map((u) => u())
      );
    };
  }, []);

  if (images == null || clock == null) return;

  const missingImages = [];

  for (let content of generateImageContents(clock)) {
    if (!images.find((img) => img.content == content)) {
      missingImages.push(content);
      if (missingImages.length > 10) break;
    }
  }

  if (missingImages.length > 0) {
    return (
      <Flex gap={4} align="center" colorPalette="blue" p={2}>
        <Flex textWrap="nowrap">Next to add:</Flex>
        <Flex overflow="hidden" gap={4}>
          {missingImages.map((content) => (
            <Button key={content} size="sm" onClick={() => setContent(content)}>
              {content}
            </Button>
          ))}
        </Flex>
      </Flex>
    );
  }
}
