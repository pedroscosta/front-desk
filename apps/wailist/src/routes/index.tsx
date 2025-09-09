import { createFileRoute } from "@tanstack/react-router";
import Dither from "~/components/dither";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Dither
        waveColor={[0.5, 0.5, 0.5]}
        disableAnimation={false}
        enableMouseInteraction={false}
        colorNum={4}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.05}
      />
    </div>
  );
}
