/* global cy */
const superblockPathData = require('../../../fixtures/pathData/responsive-web-design.json');

const challengePaths = superblockPathData['blocks']['applied-accessibility'];

challengePaths.forEach(challenge => {
  let challengeName = challenge.split('/');
  describe('loading challenge', () => {
    before(() => {
      cy.visit(challenge);
    });

    it(
      'Challenge ' +
        challengeName[challengeName.length - 1] +
        ' should work correctly',
      () => {
        cy.testChallenges(challenge);
      }
    );
  });
});
