import styled from "styled-components";
import { useSidebar } from "../store/useSidebarStore";
export function Sidebar(){
  const isOpened = useSidebar();

  const Side = styled.aside`
  display: ${isOpened ? 'block' : 'none'};
  top: 0;
  right: 0;
  width: 250px;
  height: 100wvh;
  background-color: black;
  z-index: 999;
  `
  return(
    <Side>

    </Side>
  )
}
