describe('Module Search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Open in semester', () => {
    cy.get('[data-cy="ModuleSearch-OpenButton"]').first().click();
    cy.get('[data-cy="ModuleSearch-DialogPanel"]').should('be.visible');

    cy.screenshot('ModuleSearch/OpenInSemester', {
      capture: 'viewport'
    });
  });

  it('Open in categories', () => {
    cy.get('[data-cy="ModuleSearch-OpenButton"]').eq(1).click();
    cy.get('[data-cy="ModuleSearch-DialogPanel"]').should('be.visible');

    cy.screenshot('ModuleSearch/OpenInCategories', {
      capture: 'viewport'
    });
  })

  it('Open in accredited modules', () => {
    cy.get('[data-cy="AccreditedModules-OpenButton"]').click();
    cy.get('[data-cy="ModuleSearch-OpenButton"]').filter(':contains("Modul auswählen")').click();
    cy.get('[data-cy="ModuleSearch-DialogPanel"]').should('be.visible');

    cy.screenshot('ModuleSearch/OpenInAccreditedModules', {
      capture: 'viewport'
    });
  })

  it('filters by category', () => {
    cy.get('[data-cy="ModuleSearch-OpenButton"]').first().click();
    cy.get('[data-cy="ModuleSearch-DialogPanel"]').should('be.visible');
    cy.get('[data-cy="ModuleFilter-CategoryFilter-Item"]').contains('Bachelor').click();
    cy.get('[data-cy="ModuleSearch-ModuleListItem-ModuleName"]').should('have.lengthOf.at.most', 2);
    cy.get('[data-cy="ModuleSearch-ModuleListItem-ModuleName"]').should('have.lengthOf.at.least', 2);

    cy.screenshot('ModuleSearch/Filter', {
      capture: 'viewport'
    });
  });
})
