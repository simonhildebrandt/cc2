import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { Flex, Image } from "@chakra-ui/react";

import { AuthContext } from "../services/auth-provider";

function SingleLayout({ now, images }) {
  const { pb } = useContext(AuthContext);

  let image = undefined;
  let offset = 0;
  do {
    const time = new Date(Number(now) + offset);
    const content = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;
    image = images.find((image) => image.content == content);
    offset += 60_000;
  } while (image === undefined);

  const url = pb.files.getURL(image, image.image);

  return (
    <Image
      src={url}
      width="100%"
      height="100%"
      objectFit="contain"
      objectPosition="50% 50%"
    />
  );
}

function SplitLayout({ now, clock, images }) {
  const { pb } = useContext(AuthContext);

  const hours = images.filter((image) => image.content.match(/\d\d\:XX/));
  const minutes = images.filter((image) => image.content.match(/XX\:\d\d/));

  const hourConstraint = parseInt(clock.range);

  const hour = (now.getHours() % hourConstraint).toString().padStart(2, "0");
  const granularity = now.getMinutes();
  const minute = (
    Math.floor(now.getMinutes() / clock.granularity_minutes) *
    clock.granularity_minutes
  )
    .toString()
    .padStart(2, "0");

  const hourImage = hours.find((image) => image.content == `${hour}:XX`);
  const minuteImage = minutes.find((image) => image.content == `XX:${minute}`);

  if (hours.length == 0 || minutes.length == 0)
    return "At least one hour and minute image require";

  if (hourImage == undefined || minuteImage == undefined)
    return `No matching images found for ${hour}:${minute}`;

  const hourUrl = pb.files.getURL(hourImage, hourImage.image);
  const minuteUrl = pb.files.getURL(minuteImage, minuteImage.image);

  return (
    <Flex
      width="100%"
      height="100%"
      flexShrink={1}
      align="center"
      justify="center"
    >
      <Image
        src={hourUrl}
        width="50%"
        height="100%"
        objectFit="contain"
        objectPosition="50% 50%"
      />
      <Image
        src={minuteUrl}
        width="50%"
        height="100%"
        objectFit="contain"
        objectPosition="50% 50%"
      />
    </Flex>
  );
}

export default function () {
  let { id } = useParams();
  const { pb } = useContext(AuthContext);
  const [images, setImages] = useState(null);
  const [clock, setClock] = useState(null);
  const [now, setNow] = useState(new Date());

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

    const cancelId = setInterval(() => {
      setNow(new Date());
    }, 60_000);

    setNow(new Date());

    return () => {
      Promise.all([unsubPromise1, unsubPromise2]).then((unsubs) =>
        unsubs.map((u) => u())
      );
      clearInterval(cancelId);
    };
  }, []);

  if (images == null || clock == null) return;

  const { mode } = clock;
  const split = mode == "split";

  if (images.length == 0) return "no images added yet";

  return split ? (
    <SplitLayout now={now} clock={clock} images={images} />
  ) : (
    <SingleLayout now={now} images={images} />
  );
}
