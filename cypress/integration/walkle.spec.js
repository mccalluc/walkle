describe('walkle', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:4000/walkle/')
  })

  it('works', () => {
    /* Home page */

    cy.contains('Like wordle, but for walks')
  })
})
