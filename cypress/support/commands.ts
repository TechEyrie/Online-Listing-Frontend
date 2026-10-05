/// <reference types="cypress" />

Cypress.Commands.add('loginAs', (email: string, password = 'Password123!') => {
  cy.clearCookies();
  cy.window().then((win) => {
    try {
      win.localStorage.clear();
      win.sessionStorage.clear();
    } catch {
      // ignore
    }
  });
  cy.visit('/login');
  cy.get('#email').clear().type(email);
  cy.get('#password').clear().type(password, { log: false });
  cy.contains('button', 'Sign in').click();
  cy.url({ timeout: 25000 }).should('include', '/dashboard');
  cy.contains('button', 'Log out', { timeout: 25000 }).should('be.visible');
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginAs(email: string, password?: string): Chainable<void>;
    }
  }
}

export {};
