import { Flex, Select, createListCollection } from "@chakra-ui/react";
import OptionsPanel from "./options-panel";

export default function ({ clock, setImageContent, imageContent }) {
  const [hour, minute] = imageContent.split(":");
  const { mode, range, granularity_minutes } = clock;

  const split = mode == "split";

  const offset = range == "12" ? 1 : 0;
  const hourOptions = createListCollection({
    items: new Array(parseInt(range)).fill(0).map((_v, i) => ({
      label: (i + offset).toString().padStart(2, "0"),
      value: (i + offset).toString().padStart(2, "0"),
    })),
  });

  const minutesOptions = createListCollection({
    items: new Array(60).fill(0).reduce((arr, _v, i) => {
      if (i % granularity_minutes == 0) {
        arr.push({
          label: i.toString().padStart(2, "0"),
          value: i.toString().padStart(2, "0"),
        });
      }
      return arr;
    }, []),
  });

  function updateHour(value) {
    const minutePortion = split ? "XX" : minute;
    setImageContent(`${value}:${minutePortion}`);
  }

  function updateMinute(value) {
    const hourPortion = split ? "XX" : hour;
    setImageContent(`${hourPortion}:${value}`);
  }

  return (
    <Flex align="center" gap={4}>
      <Flex align="center" gap={2}>
        H
        <OptionsPanel
          value={hour}
          options={hourOptions}
          onChoice={updateHour}
        />
      </Flex>
      <Flex align="center" gap={2}>
        M
        <OptionsPanel
          value={minute}
          options={minutesOptions}
          onChoice={updateMinute}
        />
      </Flex>
    </Flex>
  );
}
