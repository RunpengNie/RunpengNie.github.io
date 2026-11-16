// Projects shown on /projects, in display order.
// cover.src must be an image under public/assets/projects/ (processed by `npm run images`).
// cover.fit: "contain" for icons/logos (centered on a tinted backdrop), "cover" for screenshots.
// install (optional): { note, steps }; text wrapped in `backticks` inside a step renders as code.
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
    install: {
      note: 'Not published on the Steam Workshop. To install it manually:',
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
];

export default projects;
