import { setupClerkTestingToken } from "@clerk/testing/cypress";

describe('multiple plans', () => {
  describe('UC3: as a user I want to save multiple plans to my account', () => {
    it('save 1 plan', () => {
      setupClerkTestingToken()

      cy.visit('/');
      cy.clerkSignIn({ strategy: 'email_code', identifier: 'user1+clerk_test@lost.university' });

      const expectedModules = [
        "Application Architecture",
        "Blockchain",
      ]

      cy.get('[data-cy="ModuleSearch-OpenButton"]').first().click();
      cy.get('[data-cy="ModuleSearch-DialogPanel"]').should('be.visible');
      cy.get('[data-cy="ModuleSearch-Input"]').type(expectedModules[0]);
      cy.get('[data-cy="ModuleSearch-ModuleList"]').first().click();

      cy.get('[data-cy="ModuleSearch-OpenButton"]').first().click();
      cy.get('[data-cy="ModuleSearch-DialogPanel"]').should('be.visible');
      cy.get('[data-cy="ModuleSearch-Input"]').type(expectedModules[1]);
      cy.get('[data-cy="ModuleSearch-ModuleList"]').first().click();

      cy.get("[data-cy='SavedPlans-Dropdown-Button']").realHover();
      cy.get("[data-cy='SavePlan-Button']:visible").click();
      cy.get("[data-cy='SavePlan-Name']").type("2 modules");
      cy.get("[data-cy='SavePlan-Submit']:visible").click();

      cy.visit('/')

      cy.get("[data-cy='SavedPlans-Dropdown-Button']").realHover();
      cy.get("[data-cy='SavedPlans-List-Item']:visible").filter(`:contains("2 modules")`).click();

      cy.get('[data-cy="module-name"]').should('have.length', expectedModules.length);

      cy.get('[data-cy="module-name"]').each((element, index) => {
        cy.wrap(element).should('have.text', expectedModules[index]);
      });

      cy.get('#semester-container').screenshot('plans.cy.ts/create-plan-with-2-modules');

      cy.get("[data-cy=SavedPlans-List-Item]:visible").filter(`:contains("2 modules")`)
        .within(() => {
          cy.get('[data-cy=SavedPlans-Delete-Button]')
            .click()
        });
    });
    it('save 2 plans', () => {
      setupClerkTestingToken()

      cy.visit('/');
      cy.clerkSignIn({ strategy: 'email_code', identifier: 'user1+clerk_test@lost.university' })


      for (let i = 0; i < 2; i++) {
        const timestamp = `${new Date().getTime()}-${i}`;

        cy.get("[data-cy='SavedPlans-Dropdown-Button']").realHover();
        cy.get("[data-cy='SavePlan-Button']:visible").click();
        cy.get("[data-cy='SavePlan-Name']").type(`Test Plan ${timestamp}`);
        cy.get("[data-cy='SavePlan-Submit']:visible").click();

        cy.get("[data-cy=SavedPlans-List-Item").filter(`:contains("Test Plan ${timestamp}")`).should('exist');
      }
    });
    it('delete 1 plan', () => {
      setupClerkTestingToken()

      cy.visit('/');
      cy.clerkSignIn({ strategy: 'email_code', identifier: 'user1+clerk_test@lost.university' })

      cy.get("[data-cy='SavedPlans-Dropdown-Button']").realHover();
      cy.get("[data-cy='SavePlan-Button']:visible").click();
      cy.get("[data-cy='SavePlan-Name']").type(`Test Plan: To Delete`);
      cy.get("[data-cy='SavePlan-Submit']:visible").click();

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
