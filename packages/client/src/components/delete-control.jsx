import { useState } from "react";

import { Flex, IconButton } from "@chakra-ui/react";

import { FaTrashCan } from "react-icons/fa6";
import { TbCancel } from "react-icons/tb";

export default function ({ onDelete }) {
  const [deleting, setDeleting] = useState(false);

  function deleteClicked(e) {
    e.stopPropagation();
    if (deleting) {
      onDelete();
    } else {
      setDeleting(true);
    }
  }

  function cancelClicked(e) {
    e.stopPropagation();
    setDeleting(false);
  }

  return (
    <Flex>
      <IconButton
        colorPalette={deleting ? "red" : "gray"}
        size="sm"
        variant="ghost"
        onClick={deleteClicked}
      >
        <FaTrashCan />
      </IconButton>
      <Flex
        w={deleting ? "40px" : "0px"}
        transitionProperty="width"
        transitionDuration="100ms"
        transitionTimingFunction="ease-in-out"
        overflow="hidden"
      >
        <IconButton
          colorPalette="orange"
          size="sm"
          variant="ghost"
          onClick={cancelClicked}
        >
          <TbCancel />
        </IconButton>
      </Flex>
    </Flex>
  );
}
