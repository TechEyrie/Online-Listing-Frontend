describe('Cross-role smoke matrix', () => {
  it('seeded personas can authenticate via API and hit role-appropriate endpoints', () => {
    cy.fixture('e2e-users').then((users) => {
      const api = Cypress.env('API_URL') || 'http://127.0.0.1:5000/api';

      const login = (email: string) =>
        cy.request('POST', `${api}/auth/login`, {
          email,
          password: users.password,
        });

      login(users.admin.email).then((res) => {
        expect(res.status).to.eq(200);
        const token = res.body.data.accessToken as string;
        cy.request({
          method: 'GET',
          url: `${api}/admin/stats`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((stats) => {
          expect(stats.status).to.eq(200);
          expect(stats.body.data.totalUsers).to.be.greaterThan(10);
          expect(stats.body.data.totalListings).to.be.greaterThan(5);
          expect(stats.body.data.users).to.have.property('admin');
          expect(stats.body.data.users).to.have.property('moderator');
          expect(stats.body.data).to.have.property('userHealth');
          expect(stats.body.data).to.have.property('topListings');
          expect(stats.body.data).to.have.property('topSellers');
          expect(stats.body.data.revenueTrend).to.have.length(30);
        });
        cy.request({
          method: 'GET',
          url: `${api}/payments/admin/revenue`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((rev) => {
          expect(rev.status).to.eq(200);
          expect(rev.body.data).to.have.property('byPlan');
          expect(rev.body.data).to.have.property('byStatus');
          expect(rev.body.data).to.have.property('revenueTrend');
        });
      });

      login(users.moderators[0].email).then((res) => {
        const token = res.body.data.accessToken as string;
        cy.request({
          method: 'GET',
          url: `${api}/admin/listings`,
          headers: { Authorization: `Bearer ${token}` },
        }).its('status').should('eq', 200);
        cy.request({
          method: 'GET',
          url: `${api}/admin/stats`,
          headers: { Authorization: `Bearer ${token}` },
          failOnStatusCode: false,
        }).its('status').should('eq', 403);
      });

      users.sellers.forEach((seller: { email: string }) => {
        login(seller.email).then((res) => {
          expect(res.status).to.eq(200);
          const token = res.body.data.accessToken as string;
          cy.request({
            method: 'GET',
            url: `${api}/listings/my?limit=20`,
            headers: { Authorization: `Bearer ${token}` },
          }).its('status').should('eq', 200);
        });
      });

      users.buyers.forEach((buyer: { email: string }) => {
        login(buyer.email).then((res) => {
          expect(res.status).to.eq(200);
          const token = res.body.data.accessToken as string;
          cy.request({
            method: 'GET',
            url: `${api}/messages/conversations`,
            headers: { Authorization: `Bearer ${token}` },
          }).its('status').should('eq', 200);
        });
      });
    });
  });
});
