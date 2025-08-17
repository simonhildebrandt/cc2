import { Link } from "@chakra-ui/react";
import { NavLink } from "react-router";

export default ({ to, children }) => (
  <Link asChild>
    <NavLink to={to}>{children}</NavLink>
  </Link>
);
