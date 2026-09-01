# AI-Setup & Arbeit mit Agents

Dieses Dokument gibt einen Überblick über die Arbeit mit AI [Agenten](https://www.aihero.dev/ai-coding-dictionary/agent) im SEB Server Projekt. Es orientiert sich stark an der Arbeit von [Matt Pocock](https://github.com/mattpocock). Momentan arbeiten wir mit [Claude Code](https://claude.com/product/claude-code).

## Grundprinzipien

- **Feedback-Loops sind alles.** Agents werden massiv besser, wenn sie ihre Arbeit selbst verifizieren können ([Automated Checks](https://www.aihero.dev/ai-coding-dictionary/automated-check)): Playwright (oder andere automatisierte Tests), Typecheck, Eslint, Prettier, Browser-Zugriff. Jede Investition in deterministische Tools zahlt sich doppelt aus, weil sie nicht nur uns, sondern auch die AI besser macht.
- **Die AI imitiert, was sie sieht.** Schlechte Gewohnheiten in der Codebase beeinflussen den generierten Code direkt. Aufräumen ist keine Kosmetik, sondern verbessert auch den Output der AI.
- **Niemals Code committen, den wir nicht verstehen.** Generierten Code so lange reviewen und tweaken ([Human Review](https://www.aihero.dev/ai-coding-dictionary/human-review)), bis alles so ist, wie wir es selbst geschrieben hätten. Das ist die Grenze zu [Vibe-Coding](https://www.aihero.dev/ai-coding-dictionary/vibe-coding).

## Arbeitsmodus

- **Workflow:** [aihero.dev/skills](https://www.aihero.dev/skills) erklärt den Workflow, nach dem wir arbeiten (inkl. Doku und Erklärvideos). Kurzfassung: Idee per [Grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) klar definieren / Gegenfragen provozieren → [Spec](https://www.aihero.dev/ai-coding-dictionary/spec) → [Tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) → Umsetzung. Gutes Intro-Video: [youtube.com/watch?v=v4F1gFy-hqg](https://www.youtube.com/watch?v=v4F1gFy-hqg).
- **Der Mensch bleibt dabei** ([Human-in-the-Loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)): Der Mensch plant zusammen mit dem Agenten, der Code wird reviewed, der Agent wird auf die richtige Bahn zurückgebracht, wenn er sich verirrt. Ob man den Code auf Github oder lokal reviewed ist egal. Hauptsache, man tut es. Damit stellt man nicht nur die Codequalität sicher, sondern auch, dass man nicht den Überblick verliert.
- **Verifikation während der Entwicklung:** Der Agent muss die vorhandenen Verifikationstools verwenden (siehe Feedback-Loops). Mit Playwright-[MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) kann der Agent die Änderung selbständig im Browser gegen den laufenden Dev-Server testen, v.a. dort wo automatisierte Tests (noch) fehlen. Sobald wir eine saubere E2E-Testabdeckung haben, verliert dies an Bedeutung (automatische Tests sind billiger und schneller). Während der Entwicklung bleibt es für Claude aber ein wichtiges [Tool](https://www.aihero.dev/ai-coding-dictionary/tool).

## Setup & Werkzeuge

- **[Sandbox](https://www.aihero.dev/ai-coding-dictionary/sandbox):** Aus Sicherheitsgründen lassen wir die Agents grundsätzlich in [Docker AI Sandboxes](https://docs.docker.com/ai/sandboxes/) laufen. Alternativ kann z.B. auch [Claude Code Devcontainer](https://code.claude.com/docs/en/devcontainer) verwendet werden. Wichtig ist, dass der File- und Internetzugriff der Agenten eingeschränkt wird.
- **MCP-Server** (eingecheckt in `.mcp.json`):
  - [Playwright MCP](https://github.com/microsoft/playwright-mcp): Gibt den Agenten Zugriff auf einen (sandboxed) Browser, in dem sie die Applikation "als User" testen können.
  - [Vuetify MCP](https://github.com/vuetifyjs/mcp): Vuetify-API-Doku und Guides für den Agenten.
- **[Skills](https://www.aihero.dev/ai-coding-dictionary/skill):** Die [Skills von Matt Pocock](https://www.aihero.dev/skills) sind installiert und unter `.claude/skills/` im Repo eingecheckt. Sie sind das Rückgrat des oben beschriebenen Workflows. Wenn man nicht weiss, was man als nächstes machen soll: einfach den `/ask-matt`-Skill benutzen.
- **[Autoresearch-Skill](https://www.skills.sh/github/awesome-copilot/autoresearch):** Hilfreich, wenn man auf ein messbares Optimierungsziel hinarbeitet (z.B. Download-Geschwindigkeit, Bundle-Grösse des Client-Builds, ...).

## Wissensablage im Repo

- `.claude/CLAUDE.md`: Einstiegsfile für Claude. Dieses sollte möglichst klein gehalten werden, um den [Kontext](https://www.aihero.dev/ai-coding-dictionary/context) nicht unnötig zu füllen.
- `.claude/rules/client.md`: Konkrete Coding-Regeln, als [Rules file](https://code.claude.com/docs/en/memory#organize-rules-with-claude/rules/) (CLAUDE.md-Instruktionen, limitiert auf den `client` Ordner). Unbedingt up2date halten: So schreibt Claude den Code von Anfang an so, wie wir wollen. Das File dient Gleichzeitig uns Menschen als Nachschlagewerk.
- `.scratch/`: Die technischen Tickets und die Resultate aus Grilling-Sessions. Sie helfen den Agents, den [Kontext](https://www.aihero.dev/ai-coding-dictionary/context) und vergangene Entscheidungen zu verstehen. Wird es irgendwann zu viel, kann man alte Ordner einfach löschen. Es gibt auch die Möglichkeit, die technischen Tickets direkt im [Jira](https://jira.ethz.ch/)
- `client/CONTEXT.md` (+ `CONTEXT-MAP.md` im Root): Glossar mit den Begriffsdefinitionen. Dieses wird von Grilling-Sessions aktiv gepflegt.

## Meine Empfehlungen

1. **e2e-Testabdeckung aufbauen.** Stärkt den Feedback-Loop der Agenten und reduziert manuelle Arbeit.
2. **Einfach mal ausprobieren.** Solange man in der Sandbox ist, kann man kaum Schaden anrichten, der nicht mit `git revert` wieder rückgängig gemacht werden kann.
3. **Verstehen und am Ball bleiben.** Die Videos und Posts auf [AI-Hero](https://www.aihero.dev/) sind Gold wert. Es gibt auch Kurse.
4. `.claude/rules/client.md` **pflegen.** Jedes Mal, wenn man im Code-Review denselben Fehler zweimal korrigiert, gehört eine Regel dazu ins File.
5. **Codebase konsequent sauber halten.** Siehe Grundprinzipien: jede Altlast, die wir loswerden, verbessert den Output aller zukünftigen Sessions.
6. **Sich nicht verrückt machen lassen.** [AI-Burnout](https://www.youtube.com/watch?v=iPUn1Fnfn0k) verhindern
