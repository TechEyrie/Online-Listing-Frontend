describe('Production polish smoke journey', () => {
  it('loads public homepage with SEO-ready structure', () => {
    cy.visit('/');
    cy.get('img[alt="Suqora"]').should('be.visible');
    cy.contains('h1', 'Buy, sell, and rent with confidence').should('be.visible');
    cy.contains('Browse categories').should('be.visible');
    cy.title().should('match', /Suqora/i);
  });

  it('exposes robots.txt and sitemap.xml', () => {
    cy.request('/robots.txt').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include('Disallow: /admin');
      expect(res.body).to.include('Sitemap:');
    });

    cy.request('/sitemap.xml').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.match(/xml/);
      expect(res.body).to.include('<urlset');
    });
  });

  it('completes login and opens messages area for an existing buyer', () => {
    cy.visit('/login');
    cy.get('#email').type('reviewer-browser@example.com');
    cy.get('#password').type('Password123!');
    cy.contains('button', 'Sign in').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Review Browser').should('be.visible');
    cy.contains('a', 'Messages').click();
    cy.url().should('include', '/messages');
    cy.contains('h1', 'Messages').should('be.visible');
  });
});
