describe('walkle', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:4000/walkle/')
  })

  it('works', () => {
    cy.contains('Are we there yet?')
  })
})
