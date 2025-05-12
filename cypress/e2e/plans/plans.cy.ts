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
    it('delete 1 plan', () => {
      setupClerkTestingToken()

      cy.visit('/');
      cy.clerkSignIn({ strategy: 'email_code', identifier: 'user1+clerk_test@lost.university' })

      cy.get("[data-cy='SavedPlans-Dropdown-Button']").realHover();
      cy.get("[data-cy='SavePlan-Button']").click();
      cy.get("[data-cy='SavePlan-Name']").type(`Test Plan: To Delete`);
      cy.get("[data-cy='SavePlan-Submit']").click();

      cy.get("[data-cy=SavedPlans-List-Item").filter(`:contains("Test Plan: To Delete")`)
        .within(() => {
          cy.get('[data-cy=SavedPlans-Delete-Button]')
            .click()
        })

      cy.get("[data-cy='SavedPlans-Dropdown-Button']").realHover();
      cy.contains("[data-cy='SavedPlans-List-Item']", "Test Plan: To Delete").should('not.exist');
    });
  })
})
