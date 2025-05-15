describe('template spec', () => {
  it('passes', () => {
    const startTime = performance.now()

    cy.visit('/');

    cy.get('#app', { timeout: 2000 }).should('be.visible');

    cy.then(() => {
      const loadTime = performance.now() - startTime;
      cy.log(`Vue app load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(2000);
    });

    cy.screenshot('home')
  })
})
