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
    cy.screenshot("01-graph-view-enabled");
    cy.get('[data-cy="activate-graph-button"]').click();
    cy.get('[data-cy="graph-vueflow"]').should("be.visible");
    cy.screenshot("02-graph-view-disabled");
    cy.get('[data-cy="graph-close-button"]').click();
    cy.get('[data-cy="graph-vueflow"]').should("not.exist")
    cy.get('[data-cy="activate-graph-button"]').click();
    cy.get('[data-cy="graph-vueflow"]').should("be.visible");
    cy.screenshot("03-graph-view-enabled");
  });

  /*it("triggers fitView on FitViewButton click", () => {
    cy.get('[data-cy="activate-graph-button"]').click();
    //cy.screenshot("01-graph-view-initial-state");

    cy.get('[data-cy="graph-vueflow"]').trigger("wheel", {
      deltaY: -1000,
      bubbles: true,
      eventConstructor: "WheelEvent",
    });
    cy.screenshot("02-zoomed-out-graph");
    cy.wait(1000); 


    cy.get('[data-cy="fit-view-button"]').click();
    //cy.screenshot("03-fit-view-button-clicked");

    cy.contains("a", "Bachelor-Arbeit Informatik").then(($el) => {
      const rect = $el[0].getBoundingClientRect();
      const vh = Cypress.config("viewportHeight");
      const vw = Cypress.config("viewportWidth");

      expect(rect.top, "top ≥ 0").to.be.at.least(0);
      expect(rect.bottom, "bottom ≤ viewportHeight").to.be.at.most(vh);
      expect(rect.left, "left ≥ 0").to.be.at.least(0);
      expect(rect.right, "right ≤ viewportWidth").to.be.at.most(vw);
    });
  });

  
  it("modules can be removed and added", () => {
    cy.visit(
      "/#/RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI?startSemester=HS24"
    );
    cy.get('[data-cy="activate-graph-button"]').click();

    cy.screenshot("01-graph-with-BA");

    cy.contains("a", "Bachelor-Arbeit Informatik")
      .parent()
      .find("button.remove-module")
      .click({ force: true });

    cy.screenshot("02-graph-without-BA");


    cy.contains("a", "Bachelor-Arbeit Informatik").should("not.exist");

    cy.contains("a", "Studienarbeit Informatik")
      .parent()
      .find("button.add-pedendent-modules")
      .click({ force: true });
    cy.get(`.list-node`)
      .should("exist").and("be.visible");
    cy.contains("a", "Studienarbeit Informatik")
      .parent()
      .parent()
      .click({ force: true });

    cy.screenshot("03-graph-with-BA");

    cy.contains("a", "Bachelor-Arbeit Informatik").should("exist");
    
    cy.screenshot("graph-view-loaded");
  });



  it("all modules are displayed", () => {
    cy.visit(
      "/#/RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI?startSemester=HS24"
    );
    cy.get('[data-cy="activate-graph-button"]').click();
  
    const modules = [
      "RheKoI",
      "OOP1",
      "AutPy",
      "CN1",
      "DMI",
      "An1I",
      "Dbs1",
      "EnglScience",
      "OOP2",
      "DigCod",
      "CySec",
      "AutoSpr",
      "An2I",
      "WE1",
      "AlgDat",
      "Bsys1",
      "AIFo",
      "MsTe",
      "CPl",
      "SEP1",
      "ExEv",
      "ParProg",
      "SecSoW",
      "Bsys2",
      "AIAp",
      "DSy",
      "SEProj",
      "SEP2",
      "DigBusI",
      "PmQm",
      "CoBau",
      "UIP",
      "AppArch",
      "SAI21",
      "WI2",
      "CPlA",
      "CldSol",
      "BAI21",
      "PhAI",
    ];
  
    modules.forEach((mod) => {
      cy.get(`[data-cy="graph-vueflow"][data-id="${mod}"]`).should("exist").and("be.visible");//TODO
    });
  });
  
  it("all connects of modules do exist", () => {
    cy.visit(
      "/#/RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI?startSemester=HS24"
    );
    cy.get('[data-cy="activate-graph-button"]').click();
  
    const connections = [
      "AutoSpr->AIFo",
      "OOP1->AIFo",
      "OOP1->AlgDat",
      "OOP1->CPl",
      "OOP1->CPlA",
      "OOP1->CoBau",
      "OOP1->OOP2",
      "OOP1->MsTe",
      "OOP1->ParProg",
      "OOP1->SEP1",
      "OOP1->SEProj",
      "OOP1->WE1",
      "OOP2->AIFo",
      "OOP2->AlgDat",
      "OOP2->CPl",
      "OOP2->CPlA",
      "OOP2->CoBau",
      "OOP2->MsTe",
      "OOP2->ParProg",
      "OOP2->SEP1",
      "OOP2->SEProj",
      "OOP2->WE1",
      "AlgDat->MsTe",
      "AlgDat->CPlA",
      "Dbs1->MsTe",
      "Dbs1->DatEng",
      "Bsys1->Bsys2",
      "Bsys1->CPl",
      "Bsys1->CPlA",
      "Bsys1->CoBau",
      "Bsys1->DSy",
      "Bsys1->ParProg",
      "Bsys1->SecSoW",
      "Bsys2->CoBau",
      "CN1->SecSoW",
      "CPl->CPlA",
      "SEP1->AppArch",
      "SEP1->DSy",
      "SEP1->SEP2",
      "SEP1->SEProj",
      "SEP2->CoBau",
      "SEProj->SAI21",
      "AppArch->CldSol",
      "SAI21->BAI21",
    ].filter(Boolean);
  
    connections.forEach((conn) => {
      cy.get(`[data-cy="graph-vueflow"][data-id="${conn}"]`).should("exist").and("be.visible"); //TODO
    });
  });
  

  it("graph loads within acceptable time", () => {
    cy.visit(
      "/#/RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI?startSemester=HS24"
    );

    const maxLoadTime = 2000;
    const start = Date.now();

    cy.get('[data-cy="activate-graph-button"]').click();
    cy.wait(2000).then(() => {
      cy.screenshot("graph-load-after-2000ms");
    });

    cy.get('[data-cy="node-OOP1"]').should("exist").and("be.visible");
    cy.then(() => {
      const loadTime = Date.now() - start;
      cy.log(`Graph loaded in ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(maxLoadTime);
    });
  });*/
});

