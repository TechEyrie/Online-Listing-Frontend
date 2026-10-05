describe('Production polish smoke journey', () => {
  it('loads public homepage with SEO-ready structure', () => {
    cy.visit('/');
    cy.get('img[alt="Suqora"]').should('be.visible');
    cy.contains('h1', /Buy, sell, and rent with confidence/i).should('be.visible');
    cy.contains('a', /Browse listings/i).should('be.visible');
    cy.title().should('match', /Suqora/i);
  });

  it('logs in seeded buyer and opens messages', () => {
    cy.fixture('e2e-users').then((users) => {
      cy.loginAs(users.buyers[0].email, users.password);
      cy.visit('/dashboard');
      cy.contains(users.buyers[0].name).should('exist');
      cy.contains('a', 'Messages').click({ force: true });
      cy.url().should('include', '/messages');
      cy.contains(/Messages/i).should('exist');
    });
  });
});
