import { withCraft } from "../utils";

interface Post {
    title: string,
    markdown: string
}

interface PublishPayload {
    userId: string;
    post: Post;
}

async function getUserId(token: string): Promise<string | null> {
    const url = `https://api.medium.com/v1/me?accessToken=${token}`;

    const maybeUserId = await withCraft(api => api.httpProxy.fetch({ url })
        .then(resp => resp.data?.body?.json())
        .then(json => {
            const id = json?.data?.id;
            if (typeof id === "string") {
                return id;
            }
            throw new Error("`id` not in response");
        })
        .then(id => {
            console.log(`Successfully obtained user id: ${id}`);
            return id;
        })
        .catch(err => {
            console.error(`Error getting user id: ${JSON.stringify(err)}`);
            return null;
        }));

    if (maybeUserId == undefined) {
        return Promise.resolve(null);
    }

    return maybeUserId;
}

async function publishPost(token: string, payload: PublishPayload): Promise<void> {
    const { userId, post } = payload;
    const url = `https://api.medium.com/v1/users/${userId}/posts`;

    await withCraft(api => api.httpProxy.fetch({
        url,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Accept-Charset": "utf-8"
        },
        method: "POST",
        body: {
            type: "text",
            text: JSON.stringify({
                title: post.title,
                contentFormat: "markdown",
                content: post.markdown
            })
        }
    }));

    console.log(`Successfully published post: ${post.title}`);
}

export interface MediumApi {
    userId: () => Promise<string | null>;
    publish: (payload: PublishPayload) => Promise<void>;
}

export interface MediumConfig {
    token: string;
}

export const MkMediumApi = ({ token }: MediumConfig): MediumApi => ({
    userId: () => getUserId(token),
    publish: (payload: PublishPayload) => publishPost(token, payload)
});

