import jwt from "jsonwebtoken";
import { Buffer } from "buffer";

import { withCraft } from "../utils";

export function mkToken(key: string): string | null {
    const parts = key.split(":");
    if (parts.length !== 2) {
        return null;
    }

    const [id, secret] = parts;

    const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
        keyid: id,
        algorithm: "HS256",
        expiresIn: "5m",
        audience: "/v3/admin/"
    });

    return token;
}

interface PublishPayload {
    title: string;
    markdown: string;
}

function mobileDocTemplate(markdown: string) {
    return {
        "version": "0.3.1",
        "atoms": [],
        "cards": [
            ["markdown", { "markdown": markdown }]
        ],
        "markups": [],
        "sections": [[10, 0], [1, "p", []]]
    }
}

interface GhostApi {
    publish: (payload: PublishPayload) => Promise<void>;
}

const publishPost = (
    token: string,
    baseUrl: string
) => async (
    payload: PublishPayload
): Promise<void> => {
    const url = baseUrl + "/ghost/api/v3/admin/posts/";

    const response = await withCraft(api => api.httpProxy.fetch({
        url,
        headers: {
            "Authorization": `Ghost ${token}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: {
            type: "text",
            text: JSON.stringify({
                "posts": [{
                    "title": payload.title,
                    "status": "published",
                    "mobiledoc": JSON.stringify(
                        mobileDocTemplate(payload.markdown)
                    )
                }]
            })
        }
    }));

    if (response == null || response.status === "error") {
        throw new Error("Failed to send request!");
    }

    console.log(JSON.stringify(response.data));

    return;
}

export interface GhostConfig {
    key: string;
    url: string;
}

export function MkGhostApi({ key, url }: GhostConfig): GhostApi | null {
    const token = mkToken(key);
    if (token == null) {
        return null;
    }

    return {
        publish: publishPost(token, url)
    };
}