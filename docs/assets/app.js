const siteData = window.DOC_SITE || {};
const siteNavigation = siteData.siteNavigation || [];
const sitePages = siteData.sitePages || {};
const entityAttributes = siteData.entityAttributes || {};

const compactEntityKey = (value = "") => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

const entityKeyLookup = Object.keys(entityAttributes)
  .map((key) => ({ key, compact: compactEntityKey(key) }))
  .sort((left, right) => right.compact.length - left.compact.length);

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderMarkdown = (content = "") => (window.marked ? window.marked.parse(content.trim()) : "");

const slugify = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const assignSectionIds = (items = [], parentId = "") =>
  items.map((section) => {
    const id = section.id || (parentId ? `${parentId}-${slugify(section.title)}` : slugify(section.title));
    const subsections = section.subsections ? assignSectionIds(section.subsections, id) : [];
    return { ...section, id, subsections };
  });

const renderTables = (tables = [], spacingClass = "mt-6") =>
  tables
    .map(
      (table) => `
        <div class="data-table-block ${spacingClass}">
          <h3 class="data-table-title">${escapeHtml(table.title)}</h3>
          <div class="data-table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  ${table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${table.rows
                  .map(
                    (row) => `
                      <tr>
                        ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `
    )
    .join("");

const renderBlock = (block, { subsection = false } = {}) => {
  const tag = subsection ? "article" : "section";
  const blockClass = subsection ? "doc-subsection" : "doc-section";
  const labelClass = subsection ? "doc-subsection-label" : "doc-label";
  const titleClass = subsection ? "doc-subsection-title" : "doc-title";
  const titleTag = subsection ? "h3" : "h2";
  const copySpacing = subsection ? "mt-4" : "mt-6";
  const tableSpacing = subsection ? "mt-4" : "mt-6";

  return `
    <${tag} class="${blockClass}" id="${block.id}">
      ${block.label ? `<p class="${labelClass}">${escapeHtml(block.label)}</p>` : ""}
      ${block.title ? `<${titleTag} class="${titleClass}">${escapeHtml(block.title)}</${titleTag}>` : ""}
      ${block.copy ? `<div class="markdown-view ${copySpacing}">${renderMarkdown(block.copy)}</div>` : ""}
      ${block.tables ? renderTables(block.tables, tableSpacing) : ""}
      ${block.diagram
        ? `
          <div class="diagram-wrap ${subsection ? "mt-6" : "mt-8"}">
            <p class="diagram-hint">Passe o mouse sobre uma entidade para ver os campos e descricoes.</p>
            <pre class="mermaid">${escapeHtml(block.diagram)}</pre>
          </div>
        `
        : ""}
      ${block.sql
        ? `
          <details class="sql-example ${subsection ? "mt-6" : "mt-8"}">
            <summary>Exemplo SQL</summary>
            <pre><code class="language-sql">${escapeHtml(block.sql)}</code></pre>
          </details>
        `
        : ""}
      ${block.subsections && block.subsections.length ? `<div class="doc-subsections">${block.subsections.map((subsectionBlock) => renderBlock(subsectionBlock, { subsection: true })).join("")}</div>` : ""}
    </${tag}>
  `;
};

const renderHero = (page, currentNav) => `
  <div class="hero-surface">
    <div class="hero-topline">
      <div class="hero-badge">${escapeHtml(page.badge || "Wiki")}</div>
      <p class="hero-breadcrumb">Wiki / ${escapeHtml(currentNav.label)}</p>
    </div>

    <div class="hero-grid">
      <div class="hero-copy-block">
        <p class="hero-kicker">${escapeHtml(page.kicker || "Documentacao")}</p>
        <h1 class="hero-title">${escapeHtml(page.title)}</h1>
        <p class="hero-copy">${escapeHtml(page.summary || "")}</p>
        ${page.tags && page.tags.length
          ? `
            <div class="hero-tags" aria-label="Topicos da pagina">
              ${page.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
            </div>
          `
          : ""}
      </div>

      <div class="hero-panel">
        <p class="hero-panel-title">${escapeHtml(page.panelTitle || "Nesta pagina")}</p>
        <ul class="hero-list">
          ${(page.panelItems || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </div>

    ${page.summaryCards && page.summaryCards.length
      ? `
        <div class="hero-summary-grid">
          ${page.summaryCards
            .map(
              (card) => `
                <article class="hero-summary-card">
                  <h2 class="hero-summary-title">${escapeHtml(card.title)}</h2>
                  <p class="hero-summary-copy">${escapeHtml(card.text)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      `
      : ""}
  </div>
`;

const renderGlobalNav = (currentPageId) => `
  <nav class="page-nav-card" aria-label="Jornada da documentacao">
    <div class="page-nav-scroller">
      ${siteNavigation
        .map(
          (page) => `
            <a class="page-nav-link ${page.id === currentPageId ? "is-active" : ""}" href="${page.href}">
              <span class="page-nav-step">${escapeHtml(page.step)}</span>
              <span class="page-nav-text">
                <strong>${escapeHtml(page.label)}</strong>
                <span>${escapeHtml(page.description)}</span>
              </span>
            </a>
          `
        )
        .join("")}
    </div>
  </nav>
`;

const renderSidebar = (page, sections) => `
  <nav class="doc-sidebar-card" aria-label="Secoes da pagina">
    <p class="doc-sidebar-eyebrow">${escapeHtml(page.badge || "")}</p>
    <h2 class="doc-sidebar-title">${escapeHtml(page.sidebarTitle || page.title)}</h2>
    ${page.sidebarCopy ? `<p class="doc-sidebar-copy">${escapeHtml(page.sidebarCopy)}</p>` : ""}
    <div class="doc-sidebar-divider"></div>
    <p class="doc-sidebar-label">Nesta pagina</p>
    <div class="doc-sidebar-links">
      ${sections
        .map(
          (section) => `
            <div class="doc-sidebar-group">
              <a class="doc-sidebar-link" data-section-link="true" href="#${section.id}">${escapeHtml(section.title)}</a>
              ${section.subsections && section.subsections.length
                ? `
                  <div class="doc-sidebar-sublinks">
                    ${section.subsections
                      .map(
                        (subsection) =>
                          `<a class="doc-sidebar-sublink" data-section-link="true" data-parent-section="${section.id}" href="#${subsection.id}">${escapeHtml(subsection.title)}</a>`
                      )
                      .join("")}
                  </div>
                `
                : ""}
            </div>
          `
        )
        .join("")}
    </div>
  </nav>
`;

const renderPagerCard = (page, position) => `
  <a class="page-pager-link" href="${page.href}">
    <span class="page-pager-label">${position}</span>
    <strong class="page-pager-title">${escapeHtml(page.step)}. ${escapeHtml(page.label)}</strong>
    <span class="page-pager-copy">${escapeHtml(page.description)}</span>
  </a>
`;

const renderPager = (previousPage, nextPage) => {
  if (!previousPage && !nextPage) return "";

  return `
    <div class="page-pager">
      ${previousPage ? renderPagerCard(previousPage, "Pagina anterior") : '<div class="page-pager-spacer"></div>'}
      ${nextPage ? renderPagerCard(nextPage, "Proxima pagina") : '<div class="page-pager-spacer"></div>'}
    </div>
  `;
};

const updateDocumentMeta = (page) => {
  if (page.metaTitle) {
    document.title = page.metaTitle === "Sistema de pagamento" ? page.metaTitle : `${page.metaTitle} - Sistema de pagamento`;
  }

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta && page.metaDescription) {
    descriptionMeta.setAttribute("content", page.metaDescription);
  }
};

let tooltip;

const extractEntityName = (node) => {
  const candidates = [
    node.getAttribute?.("data-id"),
    node.getAttribute?.("id"),
    node.querySelector?.("span.nodeLabel")?.textContent,
    node.querySelector?.("foreignObject .nodeLabel")?.textContent,
    node.querySelector?.("text")?.textContent,
    node.textContent
  ].filter(Boolean);

  for (const candidate of candidates) {
    const compactCandidate = compactEntityKey(candidate);
    const match = entityKeyLookup.find(({ compact }) => compactCandidate.startsWith(compact));
    if (match) return match.key;
  }

  return null;
};

const moveTooltip = (event) => {
  if (!tooltip) return;
  const offset = 18;
  const maxLeft = Math.max(16, window.innerWidth - 560);
  const maxTop = Math.max(16, window.innerHeight - 300);
  tooltip.style.left = `${Math.min(event.clientX + offset, maxLeft)}px`;
  tooltip.style.top = `${Math.min(event.clientY + offset, maxTop)}px`;
};

const showTooltip = (event, entityName) => {
  const attributes = entityAttributes[entityName];
  if (!attributes || !tooltip) return;

  tooltip.querySelector(".entity-tooltip-title").textContent = entityName;
  tooltip.querySelector(".entity-tooltip-body").innerHTML = `
    <table class="entity-tooltip-table">
      <thead>
        <tr>
          <th>Campo</th>
          <th>Tipo</th>
          <th>Descricao</th>
        </tr>
      </thead>
      <tbody>
        ${attributes
          .map((attribute) => {
            const description = attribute.values
              ? `${attribute.description} Valores: ${attribute.values}.`
              : attribute.description;
            return `<tr><td><code>${escapeHtml(attribute.name)}</code></td><td>${escapeHtml(attribute.type)}</td><td>${escapeHtml(description)}</td></tr>`;
          })
          .join("")}
      </tbody>
    </table>
  `;

  tooltip.classList.add("visible");
  moveTooltip(event);
};

const hideTooltip = () => {
  tooltip?.classList.remove("visible");
};

const bindEntityHover = () => {
  document.querySelectorAll(".diagram-wrap").forEach((wrap) => {
    if (wrap.dataset.bound === "true") return;
    const nodes = wrap.querySelectorAll("svg g");

    nodes.forEach((node) => {
      const entityName = extractEntityName(node);
      if (!entityName) return;

      node.classList.add("interactive-entity");
      node.dataset.entityName = entityName;
      node.addEventListener("mouseenter", (event) => showTooltip(event, entityName));
      node.addEventListener("mousemove", moveTooltip);
      node.addEventListener("mouseleave", hideTooltip);
    });

    wrap.addEventListener("mousemove", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        hideTooltip();
        return;
      }

      const node = target.closest("g");
      if (!node || !wrap.contains(node)) {
        hideTooltip();
        return;
      }

      const entityName = node.dataset.entityName || extractEntityName(node);
      if (!entityName || !entityAttributes[entityName]) {
        hideTooltip();
        return;
      }

      showTooltip(event, entityName);
    });

    wrap.addEventListener("mouseleave", hideTooltip);
    wrap.dataset.bound = "true";
  });
};

const bindActiveSectionTracking = () => {
  const sectionNodes = Array.from(document.querySelectorAll(".doc-section[id], .doc-subsection[id]"));
  const links = Array.from(document.querySelectorAll("[data-section-link='true']"));
  if (!sectionNodes.length || !links.length) return;

  const linksById = new Map(
    links
      .map((link) => {
        const href = link.getAttribute("href") || "";
        return [href.startsWith("#") ? href.slice(1) : href, link];
      })
      .filter(([id]) => Boolean(id))
  );

  const setActiveLink = (activeId) => {
    links.forEach((link) => {
      link.classList.remove("is-active");
      link.classList.remove("is-active-parent");
    });

    const activeLink = linksById.get(activeId);
    if (!activeLink) return;

    activeLink.classList.add("is-active");

    const parentId = activeLink.getAttribute("data-parent-section");
    if (parentId && linksById.get(parentId)) {
      linksById.get(parentId).classList.add("is-active-parent");
    }
  };

  const syncActiveLink = () => {
    const threshold = 180;
    let activeId = sectionNodes[0].id;

    sectionNodes.forEach((section) => {
      if (section.getBoundingClientRect().top <= threshold) {
        activeId = section.id;
      }
    });

    setActiveLink(activeId);
  };

  syncActiveLink();
  window.addEventListener("scroll", syncActiveLink, { passive: true });
  window.addEventListener("hashchange", syncActiveLink);
};

document.addEventListener("DOMContentLoaded", async () => {
  const pageId = document.body.dataset.docPage || "overview";
  const currentPage = sitePages[pageId] || sitePages.overview;
  const currentNav = siteNavigation.find((page) => page.id === pageId) || siteNavigation[0];
  const currentIndex = siteNavigation.findIndex((page) => page.id === currentNav.id);
  const previousPage = currentIndex > 0 ? siteNavigation[currentIndex - 1] : null;
  const nextPage = currentIndex >= 0 && currentIndex < siteNavigation.length - 1 ? siteNavigation[currentIndex + 1] : null;
  const sectionsWithIds = assignSectionIds(currentPage.sections || []);

  updateDocumentMeta(currentPage);

  const heroRoot = document.getElementById("hero-root");
  if (heroRoot) heroRoot.innerHTML = renderHero(currentPage, currentNav);

  const pageNavRoot = document.getElementById("page-nav-root");
  if (pageNavRoot) pageNavRoot.innerHTML = renderGlobalNav(pageId);

  const sidebarRoot = document.getElementById("sidebar-root");
  if (sidebarRoot) sidebarRoot.innerHTML = renderSidebar(currentPage, sectionsWithIds);

  const sectionsRoot = document.getElementById("sections-root");
  if (sectionsRoot) sectionsRoot.innerHTML = sectionsWithIds.map((section) => renderBlock(section)).join("");

  const pagerRoot = document.getElementById("pager-root");
  if (pagerRoot) pagerRoot.innerHTML = renderPager(previousPage, nextPage);

  if (window.hljs) {
    window.hljs.highlightAll();
  }

  tooltip = document.createElement("div");
  tooltip.className = "entity-tooltip";
  tooltip.innerHTML = '<div class="entity-tooltip-title"></div><div class="entity-tooltip-body"></div>';
  document.body.appendChild(tooltip);

  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "strict",
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      themeVariables: {
        primaryColor: "#f2fbfb",
        primaryTextColor: "#102a43",
        primaryBorderColor: "#0f766e",
        lineColor: "#0f766e",
        secondaryColor: "#fff7ed",
        tertiaryColor: "#f8fafc",
        background: "#ffffff",
        fontSize: "16px"
      }
    });

    try {
      await window.mermaid.run({ querySelector: ".mermaid" });
      bindEntityHover();
    } catch (error) {
      console.warn("Falha ao renderizar diagramas Mermaid:", error);
    }
  }

  bindActiveSectionTracking();
  window.addEventListener("scroll", hideTooltip, { passive: true });
});
