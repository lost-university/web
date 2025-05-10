import { mount } from 'cypress/vue';

import ModuleSearch from "../ModuleSearch.vue";
import { store } from "../../helpers/store";

describe('ModuleSearch FilterModal Component', () => {
  beforeEach(() => {
    store.dispatch('loadModules')
    store.dispatch('loadFocuses')
    store.dispatch('loadCategories')
    mount(ModuleSearch, {
      global: {
        plugins: [store]
      }
    })

    cy.get('[data-cy="ModuleSearch-OpenButton"]').first().click();
    cy.get('[data-cy="ModuleSearch-DialogPanel"]').should('be.visible');
  });

  it('filters by name', () => {
    cy.get('[data-cy="ModuleSearch-Input"]').type('Algorithmen');
    cy.get('[data-cy="ModuleSearch-ModuleListItem-ModuleName"]')
      .each($el => cy.wrap($el).should('contain.text', 'Algorithmen'));
  });

  it('filters by category', () => {
    cy.get('[data-cy="ModuleFilter-CategoryFilter-Item"]').contains('Bachelor').click();
    cy.get('[data-cy="ModuleSearch-ModuleListItem-ModuleName"]').first()
      .should('contain.text', 'Bachelor-Arbeit Informatik');
    cy.get('[data-cy="ModuleSearch-ModuleListItem-ModuleName"]').last()
      .should('contain.text', 'Studienarbeit Informatik');
  });

  it('filters by ECTS', () => {
    cy.get('[data-cy="ModuleFilter-EctsFilter-Item"]').filter(':contains("4")').click();
    cy.get('[data-cy="ModuleSearch-ModuleListItem-ECTS"]').each($el => {
      const text = $el.text();
      const number = parseFloat(text.replace(' ECTS', ''));
      expect(number).to.be.eq(4);
    })
  });

  it('filters by semester', () => {
    cy.get('[data-cy="ModuleFilter-SemesterFilter-Item"]').last().click();
    cy.get('[data-cy="ModuleSearch-ModuleList"]').should('have.lengthOf.at.most', 5)
    cy.get('[data-cy="ModuleSearch-ModuleList"]').should('have.lengthOf.at.least', 5)
    cy.get('[data-cy="ModuleSearch-ModuleList"]')
      .first()
      .children()
      .each($el => cy.wrap($el).should('contain.text', 'Modellbildung und Simulation'));
  });
})
