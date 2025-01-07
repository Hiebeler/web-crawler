import { JSDOM } from "jsdom";

const MAX_DEPTH = 2



export async function POST(request: Request) {
    const { siteUrl } = await request.json();
    const pages: Page[] = await getLinks(0, [], siteUrl)
    const graphInput: GraphInput = formatPages(pages)
    console.log(pages)
    console.log(graphInput)
    return Response.json({
        graphInput: graphInput
    })
}


const getLinks = async (depth: number, list: Page[], siteUrl: string): Promise<Page[]> => {
    if (depth > MAX_DEPTH) return list; // Stop recursion if maximum depth is reached

    try {
        const data = await fetch(siteUrl).then((res) => res.text());
        const dom = new JSDOM(data);

        const links = dom.window.document.getElementsByTagName("a");
        for (let i = 0; i < links.length; i++) {
            let href = links[i].href;

            // Skip unsupported or invalid URLs
            if (href.startsWith("/")) {
                href = getBaseUrl(siteUrl) + href
            }
            if (!href.startsWith("http:") && !href.startsWith("https:")) {
                console.warn(`Skipping unsupported URL: ${href}`);
                continue;
            }

            const page = list.find(page => page.url === href);
            if (page) {
                // Increment count if URL already exists
                page.count++;
                if (page.source.find(i => i == siteUrl) == undefined) {
                    page.source.push(siteUrl)
                }
            } else {
                // Add the new URL and recursively fetch its links
                const newPage: Page = { count: 1, url: href, source: [siteUrl] };
                list.push(newPage);
                await getLinks(depth + 1, list, href); // Recursive call with incremented depth
            }
        }

        return list; // Return the list after processing all links
    } catch (error) {
        console.error(`Error fetching ${siteUrl}:`, error);
        return list; // Return the list even if an error occurs
    }
};

const getBaseUrl = (url: string): string => {
    const splittedUrl = url.split("/")
    const baseUrl = splittedUrl[0] + "//" + splittedUrl[2]
    return baseUrl    
}

const formatPages = (pages: Page[]) => {
    const graphInput: GraphInput = {nodes: [], links: []}
    pages.forEach(page => {
        const node: GraphNode = {id: page.url, name: page.url, val: page.count}
        graphInput.nodes.push(node)
        page.source.forEach(source => {
            const link: GraphLink = {source: source, target: page.url}
            graphInput.links.push(link)
        })
    });
    return graphInput
}