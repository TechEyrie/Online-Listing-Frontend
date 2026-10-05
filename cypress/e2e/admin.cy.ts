describe('Admin analytics & control plane', () => {
  beforeEach(() => {
    cy.fixture('e2e-users').then((users) => {
      cy.loginAs(users.admin.email, users.password);
    });
  });

  it('loads platform analytics with users, listings, revenue KPIs', () => {
    cy.visit('/admin');
    cy.contains(/Platform analytics/i, { timeout: 25000 }).should('be.visible');
    cy.contains(/Total users/i).should('be.visible');
    cy.contains(/Total listings/i).should('be.visible');
    cy.contains(/Completed revenue|Revenue/i).should('exist');
    cy.contains(/Pending reports/i).should('exist');
    cy.contains(/Users by role/i).should('exist');
    cy.contains(/Listings by status/i).should('exist');
    cy.contains(/Top listings by views/i).should('exist');
    cy.contains(/Top sellers by ads/i).should('exist');
  });

  it('users page lists seeded sellers and buyers', () => {
    cy.visit('/admin/users');
    cy.contains(/Users/i, { timeout: 25000 }).should('exist');
    cy.contains(/e2e-seller-1@suqora.test|E2E Seller 1/i).should('exist');
    cy.contains(/e2e-buyer-1@suqora.test|E2E Buyer 1/i).should('exist');
  });

  it('listings moderation page shows E2E ads', () => {
    cy.visit('/admin/listings');
    cy.contains(/Listings/i, { timeout: 25000 }).should('exist');
    cy.contains(/E2E /i).should('exist');
  });

  it('reports page shows seeded reports', () => {
    cy.visit('/admin/reports');
    cy.contains(/Reports/i, { timeout: 25000 }).should('exist');
    cy.contains(/spam|scam|offensive|duplicate|other|pending|E2E report/i).should('exist');
  });

  it('reviews and categories pages are reachable', () => {
    cy.visit('/admin/reviews');
    cy.contains(/Reviews/i, { timeout: 25000 }).should('exist');
    cy.visit('/admin/categories');
    cy.contains(/Categories/i, { timeout: 25000 }).should('exist');
  });

  it('revenue page shows KPIs and ledger filters', () => {
    cy.visit('/admin/transactions');
    cy.contains(/Revenue/i, { timeout: 25000 }).should('exist');
    cy.contains(/Total revenue/i).should('exist');
    cy.contains('button', 'completed').click();
    cy.contains('button', 'all').click();
    cy.contains('button', 'pending').should('exist');
    cy.contains('button', 'failed').should('exist');
    cy.contains('button', 'refunded').should('exist');
  });

  it('admin overview is not moderator-only home', () => {
    cy.visit('/admin');
    cy.contains(/Platform analytics/i, { timeout: 25000 }).should('be.visible');
    cy.contains(/Moderator home/i).should('not.exist');
  });
});
