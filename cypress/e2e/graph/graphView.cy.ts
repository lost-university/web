/* eslint-disable max-len */

describe('Graph View E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/graph/');
    });
  
    it('toggle between table and graph view', () => {
        cy.get('.vue-flow__viewport').should('be.visible');
        cy.get('#table-link').click();
        cy.get('#graph-link').should('be.visible');
        cy.get('#graph-link').click();
        cy.get('.vue-flow__viewport').should('be.visible');
    });

    it('triggers fitView on FitViewButton click', () => {
      cy.visit('/#/plan/RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI?startSemester=HS24');
      cy.get('#graph-link').click();

      cy.get('.vue-flow__viewport')
      .trigger('wheel', {
        deltaY: -1000,
        bubbles: true,
        eventConstructor: 'WheelEvent',
      });

      cy.get('#fit-view-button').click();

      cy.contains('a', 'Bachelor-Arbeit Informatik')
        .then($el => {
          const rect = $el[0].getBoundingClientRect()
          const vh = Cypress.config('viewportHeight')
          const vw = Cypress.config('viewportWidth')
          
          expect(rect.top,    'top ≥ 0').to.be.at.least(0)
          expect(rect.bottom, 'bottom ≤ viewportHeight').to.be.at.most(vh)
          expect(rect.left,   'left ≥ 0').to.be.at.least(0)
          expect(rect.right,  'right ≤ viewportWidth').to.be.at.most(vw)
        });
    });

    it('triggers fitView on key F press', () => {
      cy.visit('/#/plan/RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI?startSemester=HS24');
      cy.get('#graph-link').click();

      cy.get('.vue-flow__viewport')
      .trigger('wheel', {
        deltaY: -1000,
        bubbles: true,
        eventConstructor: 'WheelEvent',
      });

      cy.get('body').type('f');

      cy.contains('a', 'Bachelor-Arbeit Informatik')
        .then($el => {
          const rect = $el[0].getBoundingClientRect()
          const vh = Cypress.config('viewportHeight')
          const vw = Cypress.config('viewportWidth')
          
          expect(rect.top,    'top ≥ 0').to.be.at.least(0)
          expect(rect.bottom, 'bottom ≤ viewportHeight').to.be.at.most(vh)
          expect(rect.left,   'left ≥ 0').to.be.at.least(0)
          expect(rect.right,  'right ≤ viewportWidth').to.be.at.most(vw)
        });
    });

    it('Modules are displayed', () => {
      cy.visit('/#/plan/RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI?startSemester=HS24');
      cy.get('#graph-link').click();
      cy.contains('a', 'Bachelor-Arbeit Informatik').should('be.visible');
    });
  
    it('Modules can be removed', () => {
      cy.visit('/#/plan/RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI?startSemester=HS24');
      cy.get('#graph-link').click();

      cy.contains('a', 'Bachelor-Arbeit Informatik')
        .parent()
        .find('button.remove-module')
        .click({ force: true });
      cy.contains('a', 'Bachelor-Arbeit Informatik').
        should('not.exist');
    });


});
