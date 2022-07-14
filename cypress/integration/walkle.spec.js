function mock(latitude, longitude) {
  // https://github.com/cypress-io/cypress/issues/2671#issuecomment-444069577
  return {
    onBeforeLoad(win) {
      cy.stub(win.navigator.geolocation, "getCurrentPosition", (cb, err) => {
        if (latitude && longitude) {
          return cb({ coords: { latitude, longitude } });
        }
        throw err({ code: 1 }); // 1: rejected, 2: unable, 3: timeout
      });

      cy.stub(win.Date, "now", () => {
        return 1657835071908;
      });
    }
  };
}

describe('walkle', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:4000/walkle/', mock(42.36, -71.06))
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
