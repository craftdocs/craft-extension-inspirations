import React from "react";
import { exportToBear, exportToDayOne, exportToIA, exportToOmni, exportToThings, exportToUlysses } from "./DeepLinks";
import { Icon } from "./ui";

import BearIcon from "./assets/bear.png";
import DayOneIcon from "./assets/dayone.png";
import IAWriterIcon from "./assets/ia.png";
import OmniIcon from "./assets/omnifocus.png";
import ThingsIcon from "./assets/things.png";
import UlyssesIcon from "./assets/ulysses.png";

export const SUPPORTED_APPS = ["Bear", "DayOne", "iA Writer", "OmniFocus", "Things", "Ulysses"] as const;
export type SupportedApp = typeof SUPPORTED_APPS[number];

export interface ExportApp {
    name: SupportedApp;
    icon: JSX.Element;
    homepage: string;
    enabled: boolean;
    runExport: () => Promise<void>;
}

export const APPS: ExportApp[] = [
    {
        name: "Bear",
        icon: <Icon src={BearIcon} alt={"Bear"} />,
        homepage: "https://bear.app",
        enabled: true,
        runExport: exportToBear,
    },
    {
        name: "DayOne",
        icon: <Icon src={DayOneIcon} alt={"Day One"} />,
        homepage: "https://dayoneapp.com",
        enabled: true,
        runExport: exportToDayOne
    },
    {
        name: "iA Writer",
        icon: <Icon src={IAWriterIcon} alt={"iA Writer"} />,
        homepage: "https://ia.net/writer",
        enabled: true,
        runExport: exportToIA
    },
    {
        name: "OmniFocus",
        icon: <Icon src={OmniIcon} alt={"OmniFocus"} />,
        homepage: "https://www.omnigroup.com/omnifocus/",
        enabled: true,
        runExport: exportToOmni
    },
    {
        name: "Things",
        icon: <Icon src={ThingsIcon} alt={"Things 3"} />,
        homepage: "https://culturedcode.com/things/",
        enabled: true,
        runExport: exportToThings
    },
    {
        name: "Ulysses",
        icon: <Icon src={UlyssesIcon} alt={"Ulysses"} />,
        homepage: "https://ulysses.app",
        enabled: true,
        runExport: exportToUlysses
    },
];