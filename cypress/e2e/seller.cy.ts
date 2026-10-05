describe('Seller journeys', () => {
  it('logs in all 5 sellers and opens my-listings', () => {
    cy.fixture('e2e-users').then((users) => {
      users.sellers.forEach((seller: { email: string; name: string }) => {
        cy.loginAs(seller.email, users.password);
        cy.visit('/my-listings');
        cy.contains(/My listings|Listings/i).should('exist');
        cy.contains(seller.name).should('exist');
      });
    });
  });

  it('seller 1 can fill every post-listing field through preview', () => {
    cy.fixture('e2e-users').then((users) => {
      cy.loginAs(users.sellers[0].email, users.password);
      cy.visit('/post');

      cy.get('#title').clear().type('E2E Cypress Live Listing Desk');
      cy.get('#description')
        .clear()
        .type('Posted via Cypress to validate every listing form field end to end.');
      cy.get('#price').clear().type('1250');
      cy.get('#currency').select('QAR');
      cy.get('#priceType').select('negotiable');
      cy.get('#type').select('sale');
      cy.get('#condition').select('used');
      cy.contains('button', 'Continue').click();

      cy.contains('label', /Category/i)
        .parent()
        .find('select')
        .then(($select) => {
          const opts = Array.from($select[0].options).filter((o) => o.value);
          expect(opts.length).to.be.greaterThan(0);
          cy.wrap($select).select(opts[Math.min(2, opts.length - 1)].value);
        });
      cy.get('#country').select('Qatar');
      cy.get('#state').should('exist').then(($el) => {
        if ($el.is('select') && $el.find('option').length > 1) {
          cy.wrap($el).select($el.find('option').eq(1).val() as string);
        }
      });
      cy.get('#city').should('exist').then(($el) => {
        if ($el.is('select') && $el.find('option').length > 1) {
          cy.wrap($el).select($el.find('option').eq(1).val() as string);
        } else if ($el.is('input')) {
          cy.wrap($el).clear().type('Doha');
        }
      });
      cy.contains('button', 'Continue').click();
      cy.contains('button', 'Continue').click();
      cy.contains('button', /Publish listing/i).should('be.visible');
      cy.contains(/E2E Cypress Live Listing Desk|Preview/i).should('exist');
    });
  });

  it('seller can open promote or edit for an owned listing when present', () => {
    cy.fixture('e2e-users').then((users) => {
      cy.loginAs(users.sellers[2].email, users.password);
      cy.visit('/my-listings');
      cy.get('body').then(($body) => {
        if ($body.find('a[href*="/promote/"]').length) {
          cy.get('a[href*="/promote/"]').first().click({ force: true });
          cy.url().should('include', '/promote/');
        } else if ($body.find('a[href*="/edit-listing/"]').length) {
          cy.get('a[href*="/edit-listing/"]').first().should('exist');
        } else {
          cy.contains(/listing|No |empty|yet/i).should('exist');
        }
      });
    });
  });
});
