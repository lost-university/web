import { setupClerkTestingToken } from "@clerk/testing/cypress";

describe('multiple plans', () => {
  describe('as a user I want to save multiple plans to my account', () => {
    it('save 2 plans', () => {
      setupClerkTestingToken()

      cy.visit('/');
      cy.clerkSignIn({ strategy: 'email_code', identifier: 'user1+clerk_test@lost.university' })


      for (let i = 0; i < 2; i++) {
        const timestamp = `${new Date().getTime()}-${i}`;

        cy.get("[data-cy='SavedPlans-Dropdown-Button']").realHover();
        cy.get("[data-cy='SavePlan-Button']").click();
        cy.get("[data-cy='SavePlan-Name']").type(`Test Plan ${timestamp}`);
        cy.get("[data-cy='SavePlan-Submit']").click();

        cy.get("[data-cy=SavedPlans-List-Item").filter(`:contains("Test Plan ${timestamp}")`).should('exist');
      }
    });
      cy.get("[data-cy='SavedPlans-Dropdown-Button']").realHover();
      cy.get("[data-cy='SavePlan-Button']").click();
      cy.get("[data-cy='SavePlan-Name']").type('Test Plan 1');
      cy.get("[data-cy='SavePlan-Submit']").click();
    })
  })
})
