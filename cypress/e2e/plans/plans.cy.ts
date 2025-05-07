import { setupClerkTestingToken } from "@clerk/testing/cypress";

describe('multiple plans', () => {
  describe('as a user I want to save multiple plans to my account', () => {
    it('happy case :)', () => {
      setupClerkTestingToken()

      cy.visit('/');
      cy.clerkSignIn({ strategy: 'email_code', identifier: 'user1+clerk_test@lost.university' })

      //cy.get("[data-cy='SavedPlans-Dropdown-Button']").trigger('onmouseover')
      //cy.get("[data-cy='SavedPlans-Dropdown-Button']").trigger('mouseenter')
      //cy.get("[data-cy='SavedPlans-Dropdown-Button']").invoke('trigger', 'contextmenu')
      cy.get("[data-cy='SavedPlans-Dropdown-Button']").realHover();
      cy.get("[data-cy='SavePlan-Button']").click();
      cy.get("[data-cy='SavePlan-Name']").type('Test Plan 1');
      cy.get("[data-cy='SavePlan-Submit']").click();
    })
  })
})
