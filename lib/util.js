import fs from "fs";
import { join } from "path";
import remark from "remark";
import html from "remark-html";

const dataDir = join(process.cwd(), 'content')

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function getIndexMarkdown() {
  const fileContents = fs.readFileSync(join(dataDir, 'index.md'), "utf8");
  return markdownToHtml(fileContents)
}
