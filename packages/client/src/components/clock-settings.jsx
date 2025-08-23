import { useEffect, useContext, useState } from "react";
import {
  Flex,
  Heading,
  Select,
  Editable,
  IconButton,
  createListCollection,
} from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import {
  TbNumber1Small,
  TbNumber5Small,
  TbNumber10Small,
  TbNumber15Small,
  TbClock12,
  TbClock24,
} from "react-icons/tb";
import { PiStop, PiSquareSplitHorizontal } from "react-icons/pi";
import { FaAngleLeft } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router";

import { AuthContext } from "../services/auth-provider";
import IconGroup from "./icon-group";

const granularityOptions = createListCollection({
  items: [
    { label: "1 minute", value: 1, icon: <TbNumber1Small /> },
    { label: "5 minutes", value: 5, icon: <TbNumber5Small /> },
    { label: "10 minutes", value: 10, icon: <TbNumber10Small /> },
    { label: "15 minutes", value: 15, icon: <TbNumber15Small /> },
  ],
});

const modeOptions = createListCollection({
  items: [
    { label: "Split", value: "split", icon: <PiSquareSplitHorizontal /> },
    { label: "Single", value: "single", icon: <PiStop /> },
  ],
});

const rangeOptions = createListCollection({
  items: [
    { label: "12 Hour", value: "12", icon: <TbClock12 /> },
    { label: "24 Hour", value: "24", icon: <TbClock24 /> },
  ],
});

export default function ({ clockId }) {
  const { pb } = useContext(AuthContext);
  const [clock, setClock] = useState(null);
  const navigate = useNavigate();

  function getClock() {
    pb.collection("clocks")
      .getOne(clockId)
      .then((data) => {
        setClock(data);
      });
  }

  useEffect(() => {
    getClock();
  }, []);

  function saveClock(data) {
    pb.collection("clocks")
      .update(clockId, data)
      .then((data) => {
        setClock(data);
      });
  }
  function saveGranularity({ value }) {
    saveClock({ granularity_minutes: parseInt(value, 10) });
  }
  function saveMode({ value }) {
    saveClock({ mode: value });
  }
  function saveRange({ value }) {
    saveClock({ range: value });
  }
  function saveName({ value }) {
    saveClock({ name: value });
  }

  if (clock == null) return;

  return (
    <>
      <Flex gap={2} alignItems="center" flexGrow={1} wrap="wrap">
        <Flex>
          <IconButton
            variant="subtle"
            mr={4}
            onClick={() => navigate("/clocks")}
          >
            <FaAngleLeft size="24px" />
          </IconButton>
          <IconButton
            variant="subtle"
            mr={4}
            onClick={() => navigate(`/clocks/${clockId}/show`)}
          >
            <FaEye size="24px" />
          </IconButton>
        </Flex>

        <Flex flexGrow={1}>
          <Editable.Root
            size="xl"
            defaultValue={clock.name}
            onValueCommit={saveName}
          >
            <Editable.Preview>
              <Heading>{clock.name}</Heading>
            </Editable.Preview>
            <Editable.Input minWidth="100px" />
            <Editable.Control>
              <Editable.EditTrigger asChild>
                <IconButton variant="ghost" size="xs">
                  <LuPencilLine />
                </IconButton>
              </Editable.EditTrigger>
              <Editable.CancelTrigger asChild>
                <IconButton variant="outline" size="xs">
                  <LuX />
                </IconButton>
              </Editable.CancelTrigger>
              <Editable.SubmitTrigger asChild>
                <IconButton variant="outline" size="xs">
                  <LuCheck />
                </IconButton>
              </Editable.SubmitTrigger>
            </Editable.Control>
          </Editable.Root>
        </Flex>

        <Flex gap={6}>
          <IconGroup
            collection={rangeOptions}
            value={clock.range}
            onValueChange={saveRange}
            hint="Choose 12 or 24 hour mode"
          />

          <IconGroup
            collection={granularityOptions}
            value={clock.granularity_minutes}
            onValueChange={saveGranularity}
            hint="Choose increments of 1, 5, 10, or 15 minutes"
          />

          <IconGroup
            collection={modeOptions}
            value={clock.mode}
            onValueChange={saveMode}
            hint="Choose between split or single mode (single photos or hour/minute composites)"
          />
        </Flex>
      </Flex>
    </>
  );
}
