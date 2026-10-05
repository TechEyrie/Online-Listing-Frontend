describe('Auth fields & flows', () => {
  it('shows login validation for empty submit', () => {
    cy.visit('/login');
    cy.contains('button', 'Sign in').click();
    cy.contains(/required|email/i).should('be.visible');
  });

  it('rejects invalid credentials with an error message', () => {
    cy.visit('/login');
    cy.get('#email').type('nobody-e2e@suqora.test');
    cy.get('#password').type('WrongPassword999!');
    cy.contains('button', 'Sign in').click();
    cy.contains(/invalid|failed|incorrect|credentials/i).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('logs in each of the 5 buyers', () => {
    cy.fixture('e2e-users').then((users) => {
      users.buyers.forEach((buyer: { email: string; name: string }) => {
        cy.loginAs(buyer.email, users.password);
        cy.visit('/dashboard');
        cy.contains('button', 'Log out').should('be.visible');
        cy.contains(buyer.name).should('exist');
        cy.contains('a', 'Messages').should('exist');
        cy.contains('button', 'Log out').click();
        cy.url().should('include', '/login');
      });
    });
  });

  it('register form exposes all account fields and role options', () => {
    cy.visit('/register');
    cy.get('#name').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#phone').should('be.visible');
    cy.get('#role').should('be.visible');
    cy.get('#role option').should('have.length.at.least', 3);
    cy.get('#role').select('agent');
    cy.get('#role').select('brand');
    cy.get('#role').select('user');
    cy.contains('button', 'Create account').should('be.visible');
    cy.contains('a', 'Sign in').should('have.attr', 'href', '/login');
  });

  it('forgot-password page accepts email field', () => {
    cy.visit('/forgot-password');
    cy.get('#email, input[type="email"]').first().should('exist').type('e2e-buyer-1@suqora.test');
    cy.contains('button', /send|reset|submit/i).click();
    cy.get('body').should('exist');
  });
});
