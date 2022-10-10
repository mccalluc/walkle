function mock({latitude, longitude, geolocationError}) {
  // https://github.com/cypress-io/cypress/issues/2671#issuecomment-444069577
  return {
    onBeforeLoad(win) {
      cy.stub(win.navigator.geolocation, "getCurrentPosition", (cb, err) => {
        if (geolocationError) {
          throw err(geolocationError);
        } else {
          return cb({ coords: { latitude, longitude } });
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
    cy.visit('http://127.0.0.1:4000/walkle/', mock({latitude: 42.36, longitude: -71.06}))
  })

  it('works', () => {
    cy.contains('Walkle')
    cy.contains('Walk 0.67 km ENE')
    cy.contains('Are we there yet?').click()
    cy.contains('Still 0.67 km ENE')
    cy.contains('Move the goal: not allowed after start!')
    cy.contains('Settings').click()
  })
})

describe('geolocation error', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:4000/walkle/', mock({geolocationError: {code: 42, message: 'Boo!'}}))
  })

  it('handles rejection', () => {
    cy.contains('Walkle')
    cy.contains('Error code 42: Boo!')
  })
})
