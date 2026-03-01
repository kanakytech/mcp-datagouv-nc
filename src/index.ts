#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BASE_URL = "https://data.gouv.nc/api/explore/v2.1";

async function apiFetch(path: string, params: Record<string, string | number> = {}): Promise<unknown> {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText} — ${url.toString()}`);
  }
  return response.json();
}

const server = new Server(
  {
    name: "mcp-datagouv-nc",
    version: "1.0.0",
  },
  {
    capabilities: { tools: {} },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_datasets",
      description:
        "Liste les jeux de données disponibles sur data.gouv.nc. Peut filtrer par mot-clé, thème ou organisation. Retourne les métadonnées : ID, titre, description, thème, nombre d'enregistrements.",
      inputSchema: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description: "Mot-clé de recherche textuelle (ex: 'population', 'emploi', 'transport')",
          },
          where: {
            type: "string",
            description: "Filtre ODSQL (ex: \"theme='Economie'\" ou \"publisher='ISEE'\")",
          },
          limit: {
            type: "number",
            description: "Nombre de résultats (défaut: 20, max: 100)",
            default: 20,
          },
          offset: {
            type: "number",
            description: "Décalage pour la pagination (défaut: 0)",
            default: 0,
          },
          order_by: {
            type: "string",
            description: "Tri des résultats (ex: 'modified DESC', 'records_count DESC')",
          },
        },
      },
    },
    {
      name: "get_dataset",
      description:
        "Récupère les informations détaillées d'un jeu de données : description complète, champs disponibles, organisation productrice, date de mise à jour, nombre d'enregistrements.",
      inputSchema: {
        type: "object",
        properties: {
          dataset_id: {
            type: "string",
            description: "Identifiant du jeu de données (ex: 'population-nc-2019')",
          },
        },
        required: ["dataset_id"],
      },
    },
    {
      name: "query_records",
      description:
        "Interroge les enregistrements d'un jeu de données avec filtres ODSQL, tri et sélection de colonnes. Utiliser pour extraire des données précises.",
      inputSchema: {
        type: "object",
        properties: {
          dataset_id: {
            type: "string",
            description: "Identifiant du jeu de données",
          },
          where: {
            type: "string",
            description: "Filtre ODSQL (ex: \"commune='Nouméa'\" ou \"annee=2023\")",
          },
          select: {
            type: "string",
            description: "Colonnes à retourner, séparées par des virgules (ex: 'commune,population,annee'). Par défaut toutes.",
          },
          order_by: {
            type: "string",
            description: "Tri (ex: 'population DESC' ou 'annee ASC')",
          },
          limit: {
            type: "number",
            description: "Nombre d'enregistrements (défaut: 20, max: 100)",
            default: 20,
          },
          offset: {
            type: "number",
            description: "Décalage pour la pagination",
            default: 0,
          },
          group_by: {
            type: "string",
            description: "Regroupement ODSQL (ex: 'commune')",
          },
        },
        required: ["dataset_id"],
      },
    },
    {
      name: "get_facets",
      description:
        "Liste les valeurs disponibles pour filtrer le catalogue (thèmes, organisations, mots-clés, licences). Utile pour découvrir les catégories de données disponibles.",
      inputSchema: {
        type: "object",
        properties: {
          facet: {
            type: "string",
            description: "Nom de la facette à explorer (ex: 'theme', 'publisher', 'keyword', 'license')",
          },
        },
      },
    },
    {
      name: "get_dataset_facets",
      description:
        "Liste les valeurs distinctes d'un champ dans un jeu de données spécifique. Utile pour connaître les communes, catégories ou années disponibles dans un dataset.",
      inputSchema: {
        type: "object",
        properties: {
          dataset_id: {
            type: "string",
            description: "Identifiant du jeu de données",
          },
          facet: {
            type: "string",
            description: "Nom du champ à explorer (ex: 'commune', 'annee', 'secteur')",
          },
        },
        required: ["dataset_id"],
      },
    },
    {
      name: "get_export_url",
      description:
        "Retourne l'URL de téléchargement d'un jeu de données en CSV. Pratique pour obtenir un export complet sans limite d'enregistrements.",
      inputSchema: {
        type: "object",
        properties: {
          dataset_id: {
            type: "string",
            description: "Identifiant du jeu de données",
          },
          where: {
            type: "string",
            description: "Filtre ODSQL optionnel pour l'export",
          },
        },
        required: ["dataset_id"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case "list_datasets": {
        const params: Record<string, string | number> = {
          limit: (args.limit as number) || 20,
          offset: (args.offset as number) || 0,
        };
        if (args.search) params.search = args.search as string;
        if (args.where) params.where = args.where as string;
        if (args.order_by) params.order_by = args.order_by as string;

        const data = await apiFetch("/catalog/datasets", params);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }

      case "get_dataset": {
        const data = await apiFetch(`/catalog/datasets/${args.dataset_id}`);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }

      case "query_records": {
        const params: Record<string, string | number> = {
          limit: (args.limit as number) || 20,
          offset: (args.offset as number) || 0,
        };
        if (args.where) params.where = args.where as string;
        if (args.select) params.select = args.select as string;
        if (args.order_by) params.order_by = args.order_by as string;
        if (args.group_by) params.group_by = args.group_by as string;

        const data = await apiFetch(`/catalog/datasets/${args.dataset_id}/records`, params);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }

      case "get_facets": {
        const params: Record<string, string | number> = {};
        if (args.facet) params.facet = args.facet as string;

        const data = await apiFetch("/catalog/facets", params);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }

      case "get_dataset_facets": {
        const params: Record<string, string | number> = {};
        if (args.facet) params.facet = args.facet as string;

        const data = await apiFetch(`/catalog/datasets/${args.dataset_id}/facets`, params);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }

      case "get_export_url": {
        const url = new URL(`${BASE_URL}/catalog/datasets/${args.dataset_id}/exports/csv`);
        if (args.where) url.searchParams.set("where", args.where as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                dataset_id: args.dataset_id,
                format: "csv",
                url: url.toString(),
                note: "Aucune limite d'enregistrements pour les exports. Téléchargeable directement dans un navigateur.",
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Outil inconnu: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Erreur: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP data.gouv.nc démarré — prêt à répondre.");
}

main().catch((error) => {
  console.error("Erreur fatale:", error);
  process.exit(1);
});
