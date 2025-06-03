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

describe('SavedPlan Action Menu Component', () => {
  beforeEach(() => {

    const fakePlan = {
      id: 'plan-1',
      name: 'Test Plan',
      publicSlug: 'abc123',
      content: '/plan/1'
    };

    const onDelete = cy.spy().as('onDelete');

    mount(SavedPlansActionMenu, {
      props: {
        plan: fakePlan,
        menuPositionClass: 'top-0 left-0',
        onDelete: onDelete
      },
      global: {
        components: {
          FontAwesomeIcon
        }
      }
    });

  });


  it('Test Menu Items', () => {
    cy.get('[data-cy=SavedPlansActionMenu-Menu-Button]').click();

    cy.get('[data-cy=SavedPlansActionMenu-Share-Button]').click();

    cy.get('[data-cy=SavedPlansActionMenu-Menu-Button]').click();

    cy.get('[data-cy=SavedPlansActionMenu-Share-Icon]')
      .should('have.class', 'text-black');

    cy.get('[data-cy=SavedPlansActionMenu-Delete-Button]').click();

    cy.get('@onDelete').should('have.been.calledWith', 'plan-1');
  });
});
