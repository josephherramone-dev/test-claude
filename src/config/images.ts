/**
 * Photography slots.
 *
 * Only one authentic photograph has been supplied so far (the CARLA coach on a
 * desert road near a kasbah at dusk). Each slot uses an art-directed crop of it
 * via `position`. To replace a slot, add the new file under /public/images and
 * update `src`, `alt`, `width`, `height` and `position` here — no component
 * changes required. Recommended future shots are listed in the README.
 */
export interface ImageSlot {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position used for the crop. */
  position: string;
}

const coach = {
  src: "/images/carla-autocar-route-kasbah.jpg",
  width: 1376,
  height: 768,
};

export const images = {
  hero: {
    ...coach,
    alt: "Autocar noir Carla Tamassint Transport sur une route du sud marocain au coucher du soleil, une kasbah en arrière-plan",
    position: "62% 50%",
  },
  security: {
    ...coach,
    alt: "Face avant de l'autocar Carla Tamassint Transport, phares allumés, sur la route",
    position: "88% 60%",
  },
  time: {
    ...coach,
    alt: "Route sinueuse à travers les paysages marocains au crépuscule",
    position: "8% 70%",
  },
  comfort: {
    ...coach,
    alt: "Flanc de l'autocar Carla portant la signature « Travel in style »",
    position: "45% 55%",
  },
  training: {
    ...coach,
    alt: "Poste de conduite de l'autocar Carla Tamassint Transport vu de l'extérieur",
    position: "80% 45%",
  },
  landscape: {
    ...coach,
    alt: "Kasbah et montagnes au coucher du soleil, vues depuis la route",
    position: "12% 52%",
  },
} satisfies Record<string, ImageSlot>;

export type ImageKey = keyof typeof images;
