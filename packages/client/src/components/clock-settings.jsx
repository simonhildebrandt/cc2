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
import { TbClock12 } from "react-icons/tb";
import { FaAngleLeft } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router";

import { AuthContext } from "../services/auth-provider";

const granularityOptions = createListCollection({
  items: [
    { label: "1 minute", value: 1 },
    { label: "5 minutes", value: 5 },
    { label: "10 minutes", value: 10 },
    { label: "15 minutes", value: 15 },
  ],
});

const modeOptions = createListCollection({
  items: [
    { label: "Split", value: "split" },
    { label: "Single", value: "single" },
  ],
});

const rangeOptions = createListCollection({
  items: [
    { label: "12 Hour", value: "12" },
    { label: "24 Hour", value: "24" },
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
      <Flex>
        <IconButton variant="subtle" mr={4} onClick={() => navigate("/clocks")}>
          <FaAngleLeft size="24px" />
        </IconButton>
        <IconButton
          variant="subtle"
          mr={4}
          onClick={() => navigate(`/clocks/${clockId}/show`)}
        >
          <FaEye size="24px" />
        </IconButton>
        <Editable.Root
          size="xl"
          defaultValue={clock.name}
          onValueCommit={saveName}
        >
          <Editable.Preview>
            <Heading>{clock.name}</Heading>
          </Editable.Preview>
          <Editable.Input />
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
      <Flex gap={4}>
        <Flex>
          {/* TODO: switch to TbClock12 buttons */}
          <Select.Root
            collection={rangeOptions}
            value={[clock.range]}
            onValueChange={saveRange}
            width="180px"
          >
            <Select.Label>Mode</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select mode" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>{" "}
            <Select.Positioner>
              <Select.Content>
                {rangeOptions.items.map((option) => (
                  <Select.Item item={option} key={option.value}>
                    {option.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>{" "}
          </Select.Root>
        </Flex>
        <Flex>
          <Select.Root
            collection={granularityOptions}
            value={[clock.granularity_minutes]}
            onValueChange={saveGranularity}
            width="180px"
          >
            <Select.Label>Granularity</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select granularity" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>{" "}
            <Select.Positioner>
              <Select.Content>
                {granularityOptions.items.map((option) => (
                  <Select.Item item={option} key={option.value}>
                    {option.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>{" "}
          </Select.Root>
        </Flex>
        <Flex>
          <Select.Root
            collection={modeOptions}
            value={[clock.mode]}
            onValueChange={saveMode}
            width="180px"
          >
            <Select.Label>Style</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select mode" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>{" "}
            <Select.Positioner>
              <Select.Content>
                {modeOptions.items.map((option) => (
                  <Select.Item item={option} key={option.value}>
                    {option.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>{" "}
          </Select.Root>
        </Flex>
      </Flex>
    </>
  );
}
