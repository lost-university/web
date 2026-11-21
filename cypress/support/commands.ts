/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { addClerkCommands } from '@clerk/testing/cypress'
addClerkCommands({ Cypress, cy })

declare global {
  namespace Cypress {
    interface Chainable {
      deleteAllPlans(): Chainable<void>
    }
  }
}

// deletes the signed in user's plans through the API, so tests don't depend on how fast the list re-renders
Cypress.Commands.add('deleteAllPlans', () => {
  // getToken's promise comes from the app window, so cy.wrap it instead of using .invoke
  cy.window().its('Clerk.session').then((session) => cy.wrap(session.getToken())).then((token) => {
    const headers = { Authorization: `Bearer ${token}` };
    cy.request({ url: '/api/plans', headers }).its('body.plans').each((plan: { id: string }) => {
      cy.request({ method: 'DELETE', url: `/api/plans/${plan.id}`, headers });
    });
  });
});
