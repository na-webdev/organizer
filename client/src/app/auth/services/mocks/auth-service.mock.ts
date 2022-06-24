export const AuthServiceMock = {
  signInUser: jasmine.createSpy(),
  signUpUser: jasmine.createSpy(),
  signOut: jasmine.createSpy(),
  requestUserData: jasmine.createSpy(),
  getUserData: jasmine.createSpy(),
  getToken: jasmine.createSpy(),
  isSignedIn: jasmine.createSpy(),
  confirmUser: jasmine.createSpy(),
  requestNewToken: jasmine.createSpy(),
};
