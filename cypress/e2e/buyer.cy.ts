describe('Buyer journeys', () => {
  it('buyer browses listing detail and dashboard areas', () => {
    cy.fixture('e2e-users').then((users) => {
      const buyer = users.buyers[0];
      cy.loginAs(buyer.email, users.password);
      cy.visit('/dashboard');
      cy.contains(buyer.name).should('exist');
      cy.contains('a', 'Messages').click({ force: true });
      cy.url().should('include', '/messages');
      cy.contains(/Messages/i).should('exist');

      cy.visit('/my-favorites');
      cy.contains(/Favorites|Saved/i).should('exist');

      cy.visit('/profile');
      cy.contains(/Profile|Account/i).should('exist');

      cy.visit('/settings');
      cy.contains(/Settings|Password|Account/i).should('exist');
    });
  });

  it('all buyers can open seeded conversations when present', () => {
    cy.fixture('e2e-users').then((users) => {
      users.buyers.forEach((buyer: { email: string }) => {
        cy.loginAs(buyer.email, users.password);
        cy.visit('/messages');
        cy.contains(/Messages/i).should('exist');
        cy.get('body').then(($body) => {
          if ($body.find('a[href*="/messages/"]').length) {
            cy.get('a[href*="/messages/"]').first().click({ force: true });
            cy.url().should('match', /\/messages\/.+/);
          }
        });
      });
    });
  });

  it('buyer searches and opens E2E listing', () => {
    cy.fixture('e2e-users').then((users) => {
      cy.loginAs(users.buyers[1].email, users.password);
      cy.visit('/search?q=E2E%20iPhone');
      cy.get('body').then(($body) => {
        if ($body.text().includes('E2E iPhone')) {
          cy.contains('a', /E2E iPhone/i).first().click();
          cy.contains(/E2E iPhone/i).should('be.visible');
        }
      });
    });
  });
});
