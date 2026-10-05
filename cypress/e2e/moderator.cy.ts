describe('Moderator capabilities', () => {
  it('moderator 1 reaches listings and reports but not full analytics', () => {
    cy.fixture('e2e-users').then((users) => {
      cy.loginAs(users.moderators[0].email, users.password);
      cy.visit('/admin');
      cy.contains(/Moderator home/i, { timeout: 25000 }).should('be.visible');
      cy.contains(/admin-only|moderate listings and reports/i).should('exist');
      cy.contains('a', 'Listings').click();
      cy.url().should('include', '/admin/listings');
      cy.contains(/Listings/i).should('exist');
      cy.contains(/E2E /i).should('exist');

      cy.visit('/admin/reports');
      cy.contains(/Reports/i).should('exist');
    });
  });

  it('moderator 2 can open listings moderation UI', () => {
    cy.fixture('e2e-users').then((users) => {
      cy.loginAs(users.moderators[1].email, users.password);
      cy.visit('/admin/listings');
      cy.contains(/Listings/i, { timeout: 25000 }).should('exist');
      cy.get('table, [class*="overflow"]').should('exist');
    });
  });

  it('moderators are denied admin stats API and see moderator home', () => {
    cy.fixture('e2e-users').then((users) => {
      const api = Cypress.env('API_URL') || 'http://127.0.0.1:5000/api';
      users.moderators.forEach((mod: { email: string }) => {
        cy.request('POST', `${api}/auth/login`, {
          email: mod.email,
          password: users.password,
        }).then((res) => {
          const token = res.body.data.accessToken as string;
          cy.request({
            method: 'GET',
            url: `${api}/admin/stats`,
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode: false,
          })
            .its('status')
            .should('eq', 403);
          cy.request({
            method: 'GET',
            url: `${api}/payments/admin/revenue`,
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode: false,
          })
            .its('status')
            .should('eq', 403);
        });
        cy.loginAs(mod.email, users.password);
        cy.visit('/admin');
        cy.contains(/Moderator home/i, { timeout: 25000 }).should('be.visible');
        cy.contains(/Platform analytics/i).should('not.exist');
      });
    });
  });
});
