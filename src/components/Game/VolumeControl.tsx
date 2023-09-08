import { SpeakerModerateIcon } from "@radix-ui/react-icons";
import { Button, Flex, Popover, Slider } from "@radix-ui/themes";
import { useSnapshot } from "valtio";
import { state } from "../../store/store";

export default function VolumeControl({ handleVolume }: { handleVolume: (value: number) => void }) {
  const snapshot = useSnapshot(state);

  return (
    <Popover.Root>
      <Popover.Trigger style={{ position: "fixed", bottom: "5px", left: "5px" }}>
        <Button variant="soft" radius="full">
          <SpeakerModerateIcon />
        </Button>
      </Popover.Trigger>
      <Popover.Content side="top" size="1">
        <Flex style={{ height: "15rem" }} pb="1" direction="column" align="center" justify="center">
          <Slider
            color="indigo"
            radius="full"
            defaultValue={[50]}
            orientation="vertical"
            value={[snapshot.musicVolume]}
            onValueChange={(value) => {
              state.musicVolume = value[0];
              handleVolume(value[0] / 50);
            }}
          ></Slider>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
