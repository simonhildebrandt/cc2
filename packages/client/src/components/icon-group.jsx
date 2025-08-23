import { Flex, IconButton } from "@chakra-ui/react";
import { Tooltip } from "./ui/tooltip";

export default function IconGroup({ collection, hint, value, onValueChange }) {
  return (
    <Tooltip content={hint}>
      <Flex gap={2}>
        {collection.items.map(({ value: itemValue, label, icon }) => (
          <IconButton
            key={itemValue}
            onClick={() => onValueChange({ value: itemValue })}
            aria-label={label}
            size="lg"
            variant={itemValue == value ? "solid" : "surface"}
          >
            {icon}
          </IconButton>
        ))}
      </Flex>
    </Tooltip>
  );
}
