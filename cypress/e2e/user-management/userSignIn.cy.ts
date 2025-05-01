import { setupClerkTestingToken } from "@clerk/testing/cypress";

describe('userSignIn', () => {
  it('as a user I can sign in using clerk', () => {
    setupClerkTestingToken()

    cy.visit('/');

    cy.get("[data-cy='Navigation-SignInButton']").should('exist');
    cy.get("[data-cy='Navigation-UserButton']").should('not.exist');

    cy.clerkSignIn({ strategy: 'email_code', identifier: 'user1+clerk_test@lost.university' })

    cy.get("[data-cy='Navigation-SignInButton']").should('not.exist');
    cy.get("[data-cy='Navigation-UserButton']").should('exist');

    cy.screenshot('signed in user')
  })
})
