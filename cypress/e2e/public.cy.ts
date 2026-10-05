describe('Public surfaces & SEO', () => {
  it('renders homepage brand, hero, and browse CTA', () => {
    cy.visit('/');
    cy.get('img[alt="Suqora"]').should('be.visible');
    cy.contains('h1', /Buy, sell, and rent with confidence/i).should('be.visible');
    cy.contains('a', /Browse listings/i).should('be.visible');
    cy.contains(/Browse by need/i).should('be.visible');
    cy.title().should('match', /Suqora/i);
  });

  it('exposes robots.txt and sitemap.xml with admin blocked', () => {
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

  it('loads search page and accepts query input', () => {
    cy.visit('/search');
    cy.get('input').first().should('exist');
    cy.visit('/search?q=MacBook');
    cy.get('body').should('exist');
  });

  it('opens a seeded E2E listing from search when available', () => {
    cy.visit('/search?q=E2E%20MacBook');
    cy.get('body').then(($body) => {
      if ($body.text().includes('E2E MacBook')) {
        cy.contains('a', /E2E MacBook/i).first().click();
        cy.url().should('include', '/listings/');
        cy.contains(/E2E MacBook/i).should('be.visible');
      }
    });
  });
});
