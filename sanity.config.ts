import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schema } from '@/sanity/schema';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'notimecoffee',
  title: 'No Time Coffee',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema,
});
