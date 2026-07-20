import '@testing-library/jest-dom'

window.alert = jest.fn()
jest.spyOn(console, 'error').mockImplementation(() => {})