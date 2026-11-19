// Projects shown on /projects, in display order.
// cover.src must be an image under public/assets/projects/ (processed by `npm run images`).
// cover.fit: "contain" for icons/logos (centered on a tinted backdrop), "cover" for screenshots.
// video (optional): { src, width, height, poster? } — a demo clip in public/assets/projects/ (named
//   <project>-demo-<variant>.mp4 / <project>-demo-<variant>-poster.webp) shown in place
//   of the cover. width/height are the clip's pixel size (used to reserve space); poster is an optional still.
// notice (optional): { title, text, steps? } — a boxed note such as install instructions or availability;
//   text wrapped in `backticks` inside a step renders as code.
// links: may be empty, e.g. for private repositories.
const projects = [
  {
    id: 'enhanced-reforestation',
    title: 'Enhanced Reforestation',
    type: 'Civilization V Mod',
    summary:
      "A gameplay mod for Sid Meier's Civilization V that lets Workers plant Forests and Jungles, " +
      'turning cleared land back into woodland instead of making deforestation a one-way choice.',
    highlights: [
      'Adds two Worker builds unlocked by Fertilizer: Plant Forest (+1 Production) on Plains, Grassland, Tundra and Snow, and Plant Jungle (+1 Food) on Plains and Grassland. Both can be built outside your borders.',
      'Lua event hooks replace the finished build with a real Forest or Jungle, with a small chance to spawn a forest resource such as Deer or Silk.',
      'Supports Vanilla, Gods & Kings and Brave New World; a SQL trigger gives the new builds to Worker units added by other mods.',
      'Localized in English, German, French and Traditional Chinese.',
      'Built without an IDE: the official ModBuddy tool needs the long-discontinued Visual Studio 2010 Shell, so the SQL, Lua, XML and the .modinfo manifest are all written by hand, and every change is tested by playing the game.',
    ],
    notice: {
      title: 'How to install',
      text: 'Not published on the Steam Workshop. To install it manually:',
      steps: [
        'Download the repository as a ZIP from GitHub and extract it.',
        'Rename the extracted folder to `Enhanced Reforestation (v 1)`.',
        "Move it into `Documents\\My Games\\Sid Meier's Civilization 5\\MODS`.",
        'Launch the game, open Mods and enable Enhanced Reforestation before starting a new single-player game.',
      ],
    },
    tech: ['Lua', 'SQL', 'XML', 'Civ V Modding'],
    cover: { src: '/assets/projects/reforestation-enhanced.png', fit: 'contain' },
    links: [{ label: 'GitHub', href: 'https://github.com/RunpengNie/ReforestationEnhanced', icon: 'github' }],
    credits: "Built on FramedArchitecture's Reforestation and gwennog's Reforestation for Vox Populi.",
  },
  {
    id: 'lyra',
    title: 'Lyra',
    type: 'Android App',
    summary:
      'A native Android music player that brings local files and online music into one library, ' +
      'with synced lyrics, playlists, metadata repair and lightweight on-device recommendations.',
    highlights: [
      'Kotlin, Jetpack Compose and Material 3 in an MVVM architecture split into data, playback and UI layers. Media3 (ExoPlayer + MediaSession) handles background playback, notification and Bluetooth controls; the release APK is about 7 MB.',
      'One queue and one library for local and online tracks: favorites, play history and playlists that survive file moves and media-library rebuilds, with JSON backup and M3U8 import/export.',
      'Synced LRC lyrics with translations, also shown line by line on Bluetooth car displays. Lyrics and album art are matched automatically, but conservatively: candidates are checked against the track length, when tags are unreliable it skips rather than guessing wrong, and garbled tags (such as GBK mojibake) can be repaired in the app.',
      'Plays MP3, FLAC, ALAC, AAC, OGG, Opus and WAV natively, plus APE through a trimmed-down FFmpeg build loaded over JNI.',
      'Easy on the network: a whole-song playback cache, request throttling and persistent caches let songs that have been played once replay offline.',
      'Private by design: all data stays in app-private storage and uninstalling leaves nothing behind. The interface is available in English and Simplified Chinese.',
      'Covered by more than 330 JVM unit tests, including Room database migration tests run with Robolectric.',
    ],
    notice: {
      title: 'Availability',
      text: "Online music is sourced through some unconventional means, so I can't publish the app. If you know me in real life, feel free to ask me for a test build.",
    },
    tech: ['Kotlin', 'Jetpack Compose', 'Media3', 'Room', 'Koin', 'Retrofit', 'Coil', 'FFmpeg (JNI)'],
    cover: { src: '/assets/projects/lyra.png', fit: 'contain' },
    video: {
      src: '/assets/projects/lyra-demo-sound.mp4',
      poster: '/assets/projects/lyra-demo-sound-poster.webp',
      width: 720,
      height: 1600,
    },
    links: [],
  },
];

export default projects;
