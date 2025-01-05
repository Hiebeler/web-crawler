import { JSDOM } from "jsdom";

const MAX_DEPTH = 2

export async function POST(request: Request) {
    const { siteUrl } = await request.json();
    const splittedUrl = siteUrl.split("/")
    const baseUrl = splittedUrl[0] + "//" + splittedUrl[1]
    const list = await getLinks(baseUrl, 0, [], siteUrl)
    console.log(list)
    return Response.json({
        siteUrl
    })
}

const getLinks = async (baseUrl: string, depth: number, list: Page[], siteUrl: string): Promise<Page[]> => {
    if (depth > MAX_DEPTH) return list; // Stop recursion if maximum depth is reached

    try {
        const data = await fetch(siteUrl).then((res) => res.text());
        const dom = new JSDOM(data);

        const links = dom.window.document.getElementsByTagName("a");
        for (let i = 0; i < links.length; i++) {
            let href = links[i].href;

            // Skip unsupported or invalid URLs
            if (href.startsWith("/")) {
                href = baseUrl + href
            }
            if (!href.startsWith("http:") && !href.startsWith("https:")) {
                console.warn(`Skipping unsupported URL: ${href}`);
                continue;
            }

            const page = list.find(page => page.url === href);
            if (page) {
                // Increment count if URL already exists
                page.count++;
            } else {
                // Add the new URL and recursively fetch its links
                const newPage: Page = { count: 1, url: href };
                list.push(newPage);
                await getLinks(baseUrl, depth + 1, list, href); // Recursive call with incremented depth
            }
        }

        return list; // Return the list after processing all links
    } catch (error) {
        console.error(`Error fetching ${siteUrl}:`, error);
        return list; // Return the list even if an error occurs
    }
};