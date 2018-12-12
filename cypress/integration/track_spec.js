// import DEVICES from '../constants/devices';
import trackingInfo from '../fixtures/trackingInfo.json';

const RETAILER_NAME = trackingInfo.retailer_moniker;
const CARRIER_NAME = trackingInfo.carrier_id;
const TRACKING_NUMBER = trackingInfo.tracking_number;

describe('track', () => {
  context('Fedex JUSTSHIPPED', () => {
    it('should give rate and send feedback', () => {
      cy.server();
      cy.route({
        method: 'GET',
        url: '**/trackinginfo/**',
        response: trackingInfo,
      });

      cy.visit(
        `/${RETAILER_NAME}/tracking/${CARRIER_NAME}?tracking_numbers=${TRACKING_NUMBER}`,
        {
          onBeforeLoad(win) {
            // cypress does not currently support fetch, but
            // if we delete it, we will fall back to xhr
            delete win.fetch; // eslint-disable-line no-param-reassign
          },
        },
      );

      cy.get('#feedback-survey-stars').find('.survey-stars-star').last().click();
      cy.get('#feedback-comment-input').type('I loved tracking my package! Narvar is the best!');
      cy.get('#send-feedback-btn').click();
      cy.get('.survey-header').find('h3').should('contain', 'Thank You!');
    });
  });
});
