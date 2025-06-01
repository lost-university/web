/* eslint-disable max-len */
describe("Graph View E2E Tests", () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/Janooski/data/main/data/modules.json',
      { fixture: 'modules.json' }
    ).as('modules');

    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/Janooski/data/main/data2I/categories.json',
      { fixture: 'categories.json' }
    ).as('categories');

    cy.visit(
      "/#/plan/RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI?startSemester=HS24"
    );
  });

  it("enable and disable graph modal", () => {
    cy.screenshot("togglegraph-01-graph-view-enabled");
    cy.get('[data-cy="activate-graph-button"]').click();
    cy.get('[data-cy="graph-vueflow"]').should("be.visible");

    cy.screenshot("togglegraph-02-graph-view-disabled");
    cy.get('[data-cy="graph-close-button"]').click();
    cy.get('[data-cy="graph-vueflow"]').should("not.exist");

    cy.get('[data-cy="activate-graph-button"]').click();
    cy.get('[data-cy="graph-vueflow"]').should("be.visible");
    cy.screenshot("togglegraph-03-graph-view-enabled");
  });

  it("triggers fitView on FitViewButton click", () => {
    cy.get('[data-cy="activate-graph-button"]').click();
    cy.screenshot("fitView-01-graph-view-initial-state");

    cy.get('[data-cy="graph-vueflow"]').trigger("wheel", {
      deltaY: -2000,
      bubbles: true,
      eventConstructor: "WheelEvent",
    });
    cy.screenshot("fitView-02-zoomed-in-graph");

    cy.get('[data-cy="fit-view-button"]').click();
    cy.screenshot("fitView-003-fit-view-button-clicked");

    cy.contains('[data-cy="graph-vueflow"] a', "Bachelor-Arbeit Informatik").then(($el) => {
      cy.get('[data-cy="graph-vueflow"]').then(($container) => {
        const elRect = $el[0].getBoundingClientRect();
        const containerRect = $container[0].getBoundingClientRect();

        expect(elRect.top, "element top ≥ container top").to.be.at.least(containerRect.top);
        expect(elRect.bottom, "element bottom ≤ container bottom").to.be.at.most(containerRect.bottom);
        expect(elRect.left, "element left ≥ container left").to.be.at.least(containerRect.left);
        expect(elRect.right, "element right ≤ container right").to.be.at.most(containerRect.right);
      });
    });
  });

  it("modules can be removed and added", () => {
    cy.get('[data-cy="activate-graph-button"]').click();
    cy.screenshot("module-01-graph-with-BA");

    cy.contains('[data-cy="graph-vueflow"] a', "Bachelor-Arbeit Informatik")
      .parent()
      .find('[data-cy="remove-module-button"]')
      .click({ force: true });
    cy.screenshot("module-02-graph-without-BA");

    cy.contains('[data-cy="graph-vueflow"] a', "Bachelor-Arbeit Informatik").should("not.exist");

    cy.contains('[data-cy="graph-vueflow"] a', "Studienarbeit Informatik")
      .parent()
      .find('[data-cy="add-pedendent-modules-button"]')
      .click({ force: true });

    cy.get('[data-cy="graph-vueflow"] [data-cy="module-list"]')
      .should("exist").and("be.visible");

    cy.contains('[data-cy="graph-vueflow"] a', "Studienarbeit Informatik")
      .parent()
      .parent()
      .click({ force: true });

    cy.screenshot("module-03-graph-with-BA");
    cy.contains('[data-cy="graph-vueflow"] a', "Bachelor-Arbeit Informatik").should("exist");
    cy.screenshot("graph-view-loaded");
  });

  it("all modules are displayed", () => {
    cy.get('[data-cy="activate-graph-button"]').click();
    const modules = [
      "RheKoI", "OOP1", "AutPy", "CN1", "DMI", "An1I", "Dbs1", "EnglScience", "OOP2", "DigCod", "CySec", "AutoSpr", "An2I",
      "WE1", "AlgDat", "Bsys1", "AIFo", "MsTe", "CPl", "SEP1", "ExEv", "ParProg", "SecSoW", "Bsys2", "AIAp", "DSy",
      "SEProj", "SEP2", "DigBusI", "PmQm", "CoBau", "UIP", "AppArch", "SAI21", "WI2", "CPlA", "CldSol", "BAI21", "PhAI"
    ];
    modules.forEach((mod) => {
      cy.get(`[data-cy="graph-vueflow"] [data-id="${mod}"]`).should("exist").and("be.visible");
    });
  });

  it("all connects of modules do exist", () => {
    cy.get('[data-cy="activate-graph-button"]').click();
    const connections = [
      "AutoSpr->AIFo", "OOP1->AIFo", "OOP1->AlgDat", "OOP1->CPl", "OOP1->CPlA", "OOP1->CoBau", "OOP1->OOP2",
      "OOP1->MsTe", "OOP1->ParProg", "OOP1->SEP1", "OOP1->SEProj", "OOP1->WE1", "OOP2->AIFo", "OOP2->AlgDat",
      "OOP2->CPl", "OOP2->CPlA", "OOP2->CoBau", "OOP2->MsTe", "OOP2->ParProg", "OOP2->SEP1", "OOP2->SEProj",
      "OOP2->WE1", "AlgDat->MsTe", "AlgDat->CPlA", "Dbs1->MsTe", "Dbs1->DatEng", "Bsys1->Bsys2", "Bsys1->CPl",
      "Bsys1->CPlA", "Bsys1->CoBau", "Bsys1->DSy", "Bsys1->ParProg", "Bsys1->SecSoW", "Bsys2->CoBau", "CN1->SecSoW",
      "CPl->CPlA", "SEP1->SEP2", "SEP1->SEProj", "SEProj->SAI21", "AppArch->CldSol", "SAI21->BAI21"
    ];
    connections.forEach((conn) => {
      cy.get(`[data-id="${conn}"]`).should("exist");
    });
  });
});
