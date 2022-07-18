import { of } from 'rxjs';
import { UserMock } from './user.mock';

export const AuthServiceMock = {
  signInUser: jasmine.createSpy().and.returnValue(of({ user: UserMock })),
  signUpUser: jasmine.createSpy().and.returnValue(of({ message: 'success' })),
  signOut: jasmine.createSpy(),
  requestUserData: jasmine.createSpy(),
  getUserData: jasmine.createSpy(),
  getToken: jasmine.createSpy(),
  isSignedIn: jasmine.createSpy(),
  confirmUser: jasmine
    .createSpy()
    .and.returnValue(of({ message: 'User confirmed' })),
  requestNewToken: jasmine
    .createSpy()
    .and.returnValue(of({ message: 'Token requested' })),
};
