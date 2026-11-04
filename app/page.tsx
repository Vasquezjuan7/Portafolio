import { GameProvider } from "../components/game/GameProvider";
import TitleScreen from "../components/game/TitleScreen";
import WorldFX from "../components/game/WorldFX";
import Cursor from "../components/fx/Cursor";
import HUD from "../components/game/HUD";
import Minimap from "../components/game/Minimap";
import Toasts from "../components/game/Toasts";
import MissionBanner from "../components/game/MissionBanner";
import PauseMenu from "../components/game/PauseMenu";
import Hero from "../components/sections/Hero";
import Profile from "../components/sections/Profile";
import Missions from "../components/sections/Missions";
import Story from "../components/sections/Story";
import Arena from "../components/sections/Arena";
import Allies from "../components/sections/Allies";
import Contact from "../components/sections/Contact";
import Credits from "../components/sections/Credits";
import NameTag from "../components/NameTag";

export default function Home() {
  return (
    <GameProvider>
      <TitleScreen />
      <WorldFX />
      <HUD />

      <main className="relative z-10">
        <Hero />
        <Profile />
        <Missions />
        <Story />
        <Arena />
        <Allies />
        <Contact />
      </main>

      <Credits />

      <NameTag />

      <Minimap />
      <Toasts />
      <MissionBanner />
      <PauseMenu />
      <Cursor />
    </GameProvider>
  );
}
