import { } from "@craftdocs/craft-extension-api";
import { GhostConfig, MkGhostApi } from "./backends/Ghost";
import { MediumConfig, MkMediumApi } from "./backends/Medium";
import { withCraft } from "./utils";

export async function publishToGhost(config: GhostConfig): Promise<void> {
    const api = MkGhostApi(config);
    if (api == null) {
        throw new Error("Cannot create ghost api");
    }

    const page = await withCraft(api => api.dataApi.getCurrentPage());
    if (page == null || page.status !== "success") {
        throw new Error("Cannot fetch current page");
    }

    const title = page.data.content.reduce((acc, { text }) => acc + text, "");

    const markdown = await withCraft(
        api => api.markdown.craftBlockToMarkdown(page.data.subblocks, "common", {
            tableSupported: true
        })
    );
    if (markdown == null) {
        throw new Error("Cannot convert page to html");
    }

    await api.publish({ title, markdown });
}

export async function publishToMedium(config: MediumConfig): Promise<void> {
    const api = MkMediumApi(config);

    const page = await withCraft(api => api.dataApi.getCurrentPage());
    if (page == null || page.status !== "success") {
        throw new Error("Cannot fetch current page");
    }

    const title = page.data.content.reduce((acc, val) => acc + val.text, "");
    const markdown = withCraft(api => (
        api.markdown.craftBlockToMarkdown(
            page.data.subblocks,
            "common",
            { tableSupported: false })
    ));

    if (markdown == null) {
        throw new Error("Cannot export page to Markdown");
    }

    const userId = await api.userId();
    if (userId == null) {
        throw new Error("Cannot fetch Medium user id");
    }

    await api.publish({ userId, post: { title, markdown } });
}