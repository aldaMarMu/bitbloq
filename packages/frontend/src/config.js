import dynamic from "next/dynamic";

import { colors, Icon } from "@bitbloq/ui";

import { addShapeGroups } from "./configurations/3d/addShapeGroups";
import { bloqTypes } from "./configurations/bloqs/bloqTypes";
import { boards } from "./configurations/hardware/boards";
import { components } from "./configurations/hardware/components";
import Loading from "./components/Loading";
import { ResourcesTypes } from "./types";
import env from "./lib/env";

export { addShapeGroups, bloqTypes, boards, components };

const ENABLED_TOOLS = env.ENABLED_TOOLS || [];

const CreateDynamicComponent = (fn, loadingColor) =>
  dynamic(fn, { ssr: false, loading: () => <Loading color={loadingColor} /> });

export const documentTypes = {
  junior: {
    label: "Robótica Junior",
    shortLabel: "Junior",
    color: colors.brandOrange,
    buttonType: "orange",
    supported: ENABLED_TOOLS.includes("junior"),
    icon: "logo-junior",
    level: "Principiante",
    landingText: `Da tus primeros pasos en la robótica con una programación por bloques sencilla e intuitiva.`,
    editorComponent: CreateDynamicComponent(
      () => import("./components/JuniorEditor"),
      colors.brandOrange
    )
  },
  bloqs: {
    label: "Robótica",
    shortLabel: "Robótica",
    color: colors.green,
    supported: ENABLED_TOOLS.includes("bloqs"),
    icon: "logo-bloqs",
    level: "Medio",
    landingText:
      "Programa tus inventos por bloques y aprende los conceptos básicos de la programación."
  },
  code: {
    label: "Código Arduino®",
    shortLabel: "Arduino®",
    color: colors.brandPink,
    buttonType: "pink",
    icon: "logo-code",
    level: "Avanzado",
    landingText:
      "Da el salto al código con Arduino®. Crea tus primeros programas y da vida a tus robots.",
    supported: ENABLED_TOOLS.includes("code")
  },
  "3d": {
    acceptedResourcesTypes: [ResourcesTypes.object3D],
    label: "Diseño 3D",
    shortLabel: "Diseño 3D",
    color: colors.brandBlue,
    buttonType: "blue",
    supported: ENABLED_TOOLS.includes("3d"),
    icon: "logo-3d",
    level: "Medio",
    landingText:
      "Descubre las tres dimensiones, aprende geometría y convierte tus ideas en diseños.",
    editorComponent: CreateDynamicComponent(
      () => import("./components/ThreeDEditor"),
      colors.brandBlue
    )
  },
  apps: {
    label: "Apps",
    shortLabel: "Apps",
    color: colors.brandYellow,
    buttonType: "yellow",
    icon: "logo-apps",
    level: "Avanzado",
    landingText:
      "Empieza a diseñar y programar tus propias apps para Android®, iOS® o PC.",
    supported: ENABLED_TOOLS.includes("apps")
  }
};

export const resourceGroup = {
  label: "exercises.resources.title",
  icon: <Icon name="exercise-resources" />,
  shapes: [],
  resources: true
};

export const resourceTypes = {
  image: {
    id: "image",
    label: "cloud.resources.images",
    icon: "resource-image",
    formats: [".png", ".gif", ".jpg", ".jpeg", ".webp"]
  },
  video: {
    id: "video",
    label: "cloud.resources.videos",
    icon: "resource-video",
    formats: [".mp4", ".webm"]
  },
  sound: {
    id: "sound",
    label: "cloud.resources.sounds",
    icon: "resource-sound",
    formats: [".mp3", ".ocg"]
  },
  object3D: {
    id: "object3D",
    label: "cloud.resources.objects",
    icon: "resource-object3D",
    formats: [".stl"]
  },
  deleted: {
    id: "deleted",
    label: "cloud.resources.deleted",
    icon: "resource-deleted"
  }
};

export const plans = [
  {
    name: "unregistered",
    featureTable: [
      "create-documents",
      "download-documents",
      "open-documents",
      "create-documents-with-bq-kits",
      "exercise-access"
    ],
    ageLimit: 0
  },
  {
    name: "member",
    bitbloqCloud: true,
    highlightedFeatures: ["save-online-documents"],
    featureTable: [
      "create-documents",
      "download-documents",
      "open-documents",
      "create-documents-with-bq-kits",
      "exercise-access",
      "bitbloq-cloud",
      "save-unlimited-documents"
    ],
    isFree: true,
    ageLimit: 14
  },
  {
    name: "teacher",
    bitbloqCloud: true,
    highlightedFeatures: [
      "create-exercises",
      "correct-exercises",
      "unregistered-student-access"
    ],
    featureTable: [
      "create-documents",
      "download-documents",
      "open-documents",
      "create-documents-with-bq-kits",
      "exercise-access",
      "bitbloq-cloud",
      "save-unlimited-documents",
      "online-compilation",
      "exercise-compilation",
      "create-exercises",
      "correct-exercises"
    ],
    originalPrice: 6,
    isBetaFree: true,
    ageLimit: 18
  }
];

export const featureTable = [
  "create-documents",
  "download-documents",
  "open-documents",
  "create-documents-with-bq-kits",
  "exercise-access",
  "bitbloq-cloud",
  "save-unlimited-documents",
  "online-compilation",
  "exercise-compilation",
  "create-exercises",
  "correct-exercises"
];

export const educationalStages = [
  "preschool",
  "primary",
  "high-school",
  "college"
];

export const signupSteps = {
  birthDate: "birth-date",
  create: "create",
  leave: "leave",
  plan: "plan",
  userData: "user-data"
};

const defaultFlags = {
  SHOW_GRAPHQL_LOGS: false
};

let savedFlags = {};
if (typeof window !== `undefined`) {
  const savedFlagsString = window.localStorage.getItem("flags");
  if (savedFlagsString) {
    try {
      savedFlags = JSON.parse(savedFlagsString);
    } catch (e) {}
  }
}

export const flags = {
  ...defaultFlags,
  ...savedFlags
};

export const maxLengthName = 64;
export const maxSTLFileSize = 5242880;

export const minChromeVersion = 69;

export const supportedLanguages = ["es", "en"];
export const defaultLanguage = "es";

export const microsoftAuthEndpoint =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?";
export const microsoftScopes = "openid profile User.Read Mail.Read";

export const googleAuthEndpoint =
  "https://accounts.google.com/o/oauth2/v2/auth";

export const googleScopes =
  "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";

export const privacyPolicyUrl =
  "https://storage.googleapis.com/webstatic.bq.com/Pol%C3%ADtica%20Privacidad/Politica%20privacidad_ES.pdf";
