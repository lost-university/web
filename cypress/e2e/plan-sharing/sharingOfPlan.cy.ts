import { setupClerkTestingToken } from "@clerk/testing/cypress";

describe('sharing of plans', () => {
  it('share and open plan', () => {
    const expectedModules = [
    "Computer Grafik"
  ]

  setupClerkTestingToken();
  cy.visit('/',{
    onBeforeLoad(win) {
      if (!win.navigator.clipboard) {
        Object.defineProperty(win.navigator, 'clipboard', {
          value: {
            writeText: cy.stub().as('writeTextStub').resolves()
          },
          writable: false
        });
      } else {
        cy.stub(win.navigator.clipboard, 'writeText').as('writeTextStub').resolves();
      }
    }
  });

  cy.clerkSignIn({ strategy: 'email_code', identifier: 'user1+clerk_test@lost.university' });

  cy.get('[data-cy="ModuleSearch-OpenButton"]').first().click();
  cy.get('[data-cy="ModuleSearch-Input"]').type(expectedModules[0]);
  cy.get('[data-cy="ModuleSearch-ModuleList"]').first().click();

  cy.get('[data-cy="SavedPlans-Dropdown-Button"]').first().click();
  cy.get('[data-cy="SavePlan-Button"]').first().click();
  cy.get('[data-cy="SavePlan-Name"]').first().type("share plan");
  cy.get('[data-cy="SavePlan-Submit"]').first().click();

  cy.get('[data-cy=SavedPlansActionMenu-Menu-Button]').first().click();

  cy.get('[data-cy="semester-container"]').screenshot('sharingOfPlan.cy.ts/show-action-menu-options');

  cy.get('[data-cy=SavedPlansActionMenu-Share-Button]').first().click();

  cy.get('@writeTextStub')
    .should('have.been.calledOnce')
    .then((writeText: any) => {
      const copiedUrl = writeText.getCall(0).args[0];
      const relativeUrl = copiedUrl.substring(copiedUrl.indexOf('/#'));
      cy.visit(relativeUrl);
    });

  cy.get('[data-cy="module-name"]').should('have.length', expectedModules.length);

  cy.get('[data-cy="semester-container"]').screenshot('sharingOfPlan.cy.ts/open-shared-plan');

  cy.get('[data-cy=SavedPlansActionMenu-Delete-Button]').click({ force: true });
  });
})
