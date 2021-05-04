/* global cy */
const superblockPathData = require('../../../fixtures/pathData/javascript-algorithms-and-data-structures.json');

const challengePaths =
  superblockPathData['blocks']['basic-algorithm-scripting'];

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
