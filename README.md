# mcp-datagouv-nc

> **Serveur MCP open source** pour l'API open data du gouvernement de Nouvelle-Calédonie — [data.gouv.nc](https://data.gouv.nc)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/mcp-datagouv-nc)](https://www.npmjs.com/package/mcp-datagouv-nc)

---

## À propos de ce projet

Ce projet est une contribution open source de **[Kevyn WAHUZUE](https://linkedin.com/in/kevyn-wahuzue)**, pour soutenir la démarche d'ouverture des données publiques engagée par le Gouvernement de la Nouvelle-Calédonie (https://data.gouv.nc/api/explore/v2.0/console).

**data.gouv.nc** met à disposition des centaines de jeux de données publics (statistiques, économie, environnement, population, transport…). Ce serveur MCP rend ces données directement accessibles à tous les assistants IA compatibles — Claude, Cursor, Windsurf, et tout client MCP — sans avoir besoin d'écrire une seule ligne de code.

L'objectif est simple : **abaisser la barrière entre les données ouvertes du territoire et les outils IA modernes**, afin que chercheurs, entrepreneurs, journalistes, agents publics et citoyens puissent interroger ces données en langage naturel.

> *Ce projet s'inscrit dans une démarche citoyenne et bénévole, en soutien à la politique d'open data du Gouvernement de la Nouvelle-Calédonie et à l'expansion de l'IA au service de l'intérêt général.*

---

## ⚡ Installation en 30 secondes

### Claude Desktop

Éditez votre fichier de configuration Claude Desktop (`claude_desktop_config.json`) :

```json
{
  "mcpServers": {
    "datagouv-nc": {
      "command": "npx",
      "args": ["-y", "mcp-datagouv-nc"]
    }
  }
}
```

Redémarrez Claude Desktop. C'est tout.

### Claude Code (CLI)

```bash
claude mcp add datagouv-nc npx -y mcp-datagouv-nc
```

---

## 🛠️ Outils disponibles

| Outil | Description |
|-------|-------------|
| `list_datasets` | Liste et recherche dans le catalogue des jeux de données |
| `get_dataset` | Détails d'un dataset (champs, organisation, date de mise à jour) |
| `query_records` | Interroge les enregistrements avec filtres ODSQL |
| `get_facets` | Explore les thèmes, organisations et catégories disponibles |
| `get_dataset_facets` | Valeurs distinctes d'un champ dans un dataset |
| `get_export_url` | Génère l'URL d'export CSV complet (sans limite d'enregistrements) |

---

## 💬 Ce que vous pouvez faire

Une fois connecté, posez vos questions directement à votre assistant IA :

- *"Quels jeux de données sur la population sont disponibles ?"*
- *"Donne-moi les chiffres d'emploi à Nouméa pour 2023"*
- *"Liste tous les datasets publiés par l'ISEE"*
- *"Quels thèmes de données sont couverts sur data.gouv.nc ?"*
- *"Télécharge-moi le CSV complet du dataset sur les communes"*

---

## 📡 API source

- **Portail** : [data.gouv.nc](https://data.gouv.nc)
- **Endpoint** : `https://data.gouv.nc/api/explore/v2.1`
- **Plateforme** : Opendatasoft Explore API v2.1
- **Authentification** : Aucune — API entièrement publique
- **Méthode** : GET uniquement (lecture seule, zéro écriture)

---

## 🔧 Développement local

```bash
git clone https://github.com/kevynwahuzue/mcp-datagouv-nc
cd mcp-datagouv-nc
npm install
npm run build
```

Config locale pour Claude Desktop :

```json
{
  "mcpServers": {
    "datagouv-nc": {
      "command": "node",
      "args": ["/chemin/absolu/vers/mcp-datagouv-nc/build/index.js"]
    }
  }
}
```

---

## 🤝 Contribution

Issues, suggestions et pull requests sont les bienvenus. Ce projet est maintenu bénévolement.

Si vous représentez le Gouvernement de la Nouvelle-Calédonie ou une institution publique et souhaitez collaborer, n'hésitez pas à ouvrir une issue ou à prendre contact directement.

---

## 📄 Licence

MIT — Libre d'utilisation, de modification et de distribution.

---

*Projet indépendant, non affilié officiellement au Gouvernement de la Nouvelle-Calédonie. Utilise exclusivement l'API publique de data.gouv.nc.*

*Développé par [Kevyn WAHUZUE](https://linkedin.com/in/kevyn-wahuzue) — Nouméa, Nouvelle-Calédonie.*
