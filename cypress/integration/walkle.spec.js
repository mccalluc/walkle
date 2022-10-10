function mock({coords, geolocationError}) {
  // https://github.com/cypress-io/cypress/issues/2671#issuecomment-444069577
  return {
    onBeforeLoad(win) {
      cy.stub(win.navigator.geolocation, "getCurrentPosition", (cb, err) => {
        if (geolocationError) {
          throw err(geolocationError);
        } else {
          return cb({ coords });
        }
      });

      cy.stub(win.Date, "now", () => {
        return 1657835071908;
      });
    }
  };
}

describe('happy walkle', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:4000/walkle/', mock({coords: {latitude: 42.36, longitude: -71.06}}))
  })

  it('works', () => {
    cy.contains('Walkle')
    cy.contains('location is not sent to the server or stored')
    cy.contains('OK').click()

    cy.contains('Walk 0.67 km ENE')
    cy.contains('or move goal')
    cy.contains('North').click()
    cy.contains('Walk 2.2 km NNE')

    cy.contains('Settings').click()
    cy.get('#unit').select('mile')
    cy.contains('Walk 2.2 km NNE') // TODO: Doesn't change...

    cy.contains('Are we there yet?').click()
    cy.contains('or move goal').should('not.exist')
    cy.contains('Now go 1.4 mile NNE') // ... but this is in miles
  })
})

describe('geolocation error', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:4000/walkle/', mock({geolocationError: {code: 42, message: 'Boo!'}}))
  })

  it('handles rejection', () => {
    cy.contains('Walkle')
    cy.contains('OK').click()
    cy.contains('Error code 42: Boo!')
  })
})
