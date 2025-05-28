import { mount } from 'cypress/vue';
import SavedPlansActionMenu from '../SavedPlansActionMenu.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrash,
  faShareNodes,
  faCheck,
  faEllipsis
} from '@fortawesome/free-solid-svg-icons';

library.add(faTrash, faShareNodes, faCheck, faEllipsis);

describe('SavedPlansActionMenu.vue', () => {
  const fakePlan = {
    id: 'plan-1',
    name: 'Test Plan',
    publicSlug: 'abc123',
    content: '/plan/1'
  };

  it('should render menu and trigger share and delete actions', () => {
    const onDelete = cy.spy().as('onDelete');

    mount(SavedPlansActionMenu, {
      props: {
        plan: fakePlan,
        menuPositionClass: 'top-0 left-0',
        onDelete
      },
      global: {
        components: {
          FontAwesomeIcon
        }
      }
    });

    // Open the menu
    cy.get('[data-cy=menu-button]').click();

    // Click the share button
    cy.get('[data-cy=share-button]').click();

    // Check icon changes to checkmark
    cy.get('[data-cy=share-icon]')
      .should('have.class', 'text-green-600');

    // Wait for the menu to close automatically
    cy.wait(1200);

    // Open again
    cy.get('[data-cy=menu-button]').click();

    cy.get('[data-cy=share-icon]')
      .should('have.class', 'text-black');

    // Click the delete button
    cy.get('[data-cy=delete-button]').click();

    cy.get('@onDelete').should('have.been.calledWith', 'plan-1');
  });
});
