import { useState } from "react";
import { Flex, Popover, Button, Grid } from "@chakra-ui/react";

export default function ({ value, options, onChoice, pageHint }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleChoice(val) {
    setIsOpen(false);
    onChoice(val);
  }

  const page = pageHint ? pageHint : Math.ceil(Math.sqrt(options.items.length));
  console.log({ page });
  return (
    <Popover.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <Popover.Trigger asChild>
        <Button color={value == "XX" ? "fg.subtle" : "fg"} variant={"outline"}>
          {value}
        </Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content w={page * 40}>
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Body p={0}>
            <Grid templateColumns={`repeat(${page}, 1fr)`}>
              {options.items.map((option) => (
                <Flex key={option.value}>
                  <Button
                    width={10}
                    height={10}
                    variant="ghost"
                    onClick={() => handleChoice(option.value)}
                  >
                    {option.label}
                  </Button>
                </Flex>
              ))}
            </Grid>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}
