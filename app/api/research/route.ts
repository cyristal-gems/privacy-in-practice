import { states, categories, laws } from '@/lib/research';

// Serve the same publication-approved snapshot used by the website.
export function GET() {
  return Response.json({
    states: states.map(state => ({ id: state.code, name: state.name })),
    categories: categories.map((name, id) => ({ id, name })),
    laws: laws.map(law => ({ id: law.id, details: JSON.stringify(law) })),
  });
}
