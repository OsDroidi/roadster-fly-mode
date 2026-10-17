# Roadster: Fly Mode

A pixel-art browser game inspired by the new Tesla Roadster's flying demo. Fire the cold-gas thrusters, hop gas cars, stomp monsters, beat two bosses and make it to Mars.

> Unofficial fan game. Not affiliated with Tesla, Inc.

![The Roadster flying at night with its shield up](gameplay.png)

![Boss fight against the Smog King](boss.png)

## Play

Open `index.html` in any modern browser on a phone or computer. There is nothing to install and no build step.

To play it online, turn on GitHub Pages (steps below).

## Controls

| Action | Touch | Keyboard and mouse |
|---|---|---|
| Fire thrusters (hold), drop (let go) | Hold anywhere | Hold Space, ↑, W or the mouse button |
| Perfect launch | Tap the moment the light turns green | Press Space the moment it turns green |
| Pause | Pause button | P or Esc |
| Music on or off | Music button | N |
| Mute everything | Speaker button | M |

## What's in it

- Cold-gas thrusters, a loop-the-loop and Superchargers to keep the battery alive
- Monsters you stomp by landing on them or blast with the thrusters
- Two boss fights, the Smog King and the Mothership, won by grabbing blue coil orbs
- A Mars zone with its own monsters, scenery and music
- Power-ups: Plaid mode, Tesla coil, Bioweapon defense, Fly mode and Not a Flamethrower
- Missions, ranks, upgrades, seven paint colors and an Emissions Testing Mode easter egg
- An original chiptune soundtrack and sound effects, all synthesized in the browser
- Progress saved in the browser with localStorage

## Put it online with GitHub Pages

1. Open the repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose the `main` branch and the `/ (root)` folder, then select **Save**.
4. After a minute or two the game is live at `https://<your-username>.github.io/<repository-name>/`.

## How it's built

Everything lives in one self-contained `index.html`: canvas rendering, procedurally drawn pixel art, a Web Audio synthesizer with a small step sequencer for the music, and no external assets apart from an optional Google Font.
