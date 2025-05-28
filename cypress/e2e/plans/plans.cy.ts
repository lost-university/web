import { setupClerkTestingToken } from "@clerk/testing/cypress";

describe('multiple plans', () => {
 beforeEach(() => {
    setupClerkTestingToken();
    cy.visit('/');
    cy.clerkSignIn({ strategy: 'email_code', identifier: 'user1+clerk_test@lost.university' });
  });

  afterEach(() => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=SavedPlans-List-Item]').length > 0) {
        cy.get('[data-cy=SavedPlans-List-Item]').each(($el) => {
          cy.wrap($el).within(() => {
            cy.get('[data-cy=SavedPlans-Delete-Button]').click({ force: true });
          });
        });
      }
    });
  });

  it('save and load plan', () => {
    const expectedModules = [
      "Application Architecture",
      "Blockchain",
    ]

    cy.get('[data-cy="ModuleSearch-OpenButton"]').first().click();
    cy.get('[data-cy="ModuleSearch-Input"]').type(expectedModules[0]);
    cy.get('[data-cy="ModuleSearch-ModuleList"]').first().click();

    cy.get('[data-cy="ModuleSearch-OpenButton"]').first().click();
    cy.get('[data-cy="ModuleSearch-Input"]').type(expectedModules[1]);
    cy.get('[data-cy="ModuleSearch-ModuleList"]').first().click();

    cy.get('[data-cy="SavedPlans-Dropdown-Button"]').first().click();
    cy.get('[data-cy="SavePlan-Button"]').first().click();
    cy.get('[data-cy="SavePlan-Name"]').first().type("2 modules");
    cy.get('[data-cy="SavePlan-Submit"]').first().click();

    cy.get('[data-cy="semester-container"]').screenshot('plans.cy.ts/create-plan-with-2-modules');

    cy.visit('/')

    cy.get('[data-cy="SavedPlans-Dropdown-Button"]').first().click();
    cy.get("[data-cy='SavedPlans-List-Item']").filter(`:contains("2 modules")`).first().click();

    cy.get('[data-cy="module-name"]').should('have.length', expectedModules.length);
    cy.get('[data-cy="module-name"]').each((element, index) => {
      cy.wrap(element).should('have.text', expectedModules[index]);
    });

    cy.get('[data-cy="semester-container"]').screenshot('plans.cy.ts/load-plan-with-2-modules');
  });

  it('save 2 plans', () => {
    cy.get("[data-cy='SavedPlans-Dropdown-Button']").first().click();

    for (let i = 0; i < 2; i++) {
      const timestamp = `${new Date().getTime()}-${i}`;
      cy.get("[data-cy='SavePlan-Button']").first().click();
      cy.get("[data-cy='SavePlan-Name']").first().type(`Test Plan ${timestamp}`);
      cy.get("[data-cy='SavePlan-Submit']:visible").first().click();

      cy.get("[data-cy=SavedPlans-List-Item").filter(`:contains("Test Plan ${timestamp}")`).should('exist');
    }

    cy.get('[data-cy="semester-container"]').screenshot('plans.cy.ts/create-2-plans');
  });

  it('delete 1 plan', () => {
    cy.get("[data-cy='SavedPlans-Dropdown-Button']").first().click();

    cy.get("[data-cy='SavePlan-Button']").first().click();
    cy.get("[data-cy='SavePlan-Name']").first().type(`Test Plan: To Delete`);
    cy.get("[data-cy='SavePlan-Submit']:visible").click();

    cy.get('[data-cy="semester-container"]').screenshot('plans.cy.ts/create-to-delete-plan');

    cy.get("[data-cy=SavedPlans-List-Item").filter(`:contains("Test Plan: To Delete")`)
      .first().within(() => {
        cy.get('[data-cy=SavedPlans-Delete-Button]')
          .first().click()
      });

    cy.contains('[data-cy="SavedPlans-List-Item"]', "Test Plan: To Delete").should('not.exist');

    cy.get('[data-cy="semester-container"]').screenshot('plans.cy.ts/delete-to-delete-plan');
  });
})
