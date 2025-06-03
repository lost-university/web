/* eslint-disable max-len */
describe("Graph View E2E Tests", () => {
  beforeEach(() => {
    cy.visit(
      "/#/plan/RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI?startSemester=HS24"
    );
  });

  it("graph loads within acceptable time", () => {
    const maxLoadTime = 2000;
    const start = Date.now();

    cy.get('[data-cy="activate-graph-button"]').click();

    cy.then(() => {
      const loadTime = Date.now() - start;
      cy.log(`Graph loaded in ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(maxLoadTime);
    });

    cy.get('[data-id="OOP1"]').should("exist").and("be.visible");
  });
});

