import { Flex, Select, createListCollection } from "@chakra-ui/react";

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

  function updateHour({ value }) {
    const minutePortion = split ? "XX" : minute;
    setImageContent(`${value[0]}:${minutePortion}`);
  }

  function updateMinute({ value }) {
    const hourPortion = split ? "XX" : hour;
    setImageContent(`${hourPortion}:${value[0]}`);
  }

  return (
    <Flex align="center" gap={4}>
      <Flex align="center" gap={1}>
        H
        <Select.Root
          collection={hourOptions}
          value={[hour]}
          onValueChange={updateHour}
          width="80px"
          variant={hour == "XX" ? "subtle" : "outline"}
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select hour" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {hourOptions.items.map((option) => (
                <Select.Item item={option} key={option.value}>
                  {option.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Flex>
      <Flex align="center" gap={1}>
        M
        <Select.Root
          collection={minutesOptions}
          value={[minute]}
          onValueChange={updateMinute}
          width="80px"
          variant={minute == "XX" ? "subtle" : "outline"}
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select minute" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {minutesOptions.items.map((option) => (
                <Select.Item item={option} key={option.value}>
                  {option.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Flex>
    </Flex>
  );
}
