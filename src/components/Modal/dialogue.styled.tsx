import tw from "tailwind-styled-components";

interface DialogueProps {
  $state: string;
}

/* state === exiting || exited => opacity-0 */
const Dialogue = tw.div<DialogueProps>`
    ${(props) => (props.$state === "entering" || props.$state === "entered" ? "opacity-100" : "opacity-0")}
`;

export default Dialogue;
