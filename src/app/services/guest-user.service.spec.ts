import {GuestUserService} from './guest-user.service';
import {GuestUserModel} from '../models/GuestUser.model';
import {of, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy };
let rxStompService: { watch: jasmine.Spy };
let guestUserService: GuestUserService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  rxStompService = jasmine.createSpyObj('RxStompService', ['watch']);
  guestUserService = new GuestUserService(httpClientSpy as any, rxStompService as any);
});

it('should return expected guest users (HttpClient called once)', () => {
  const roomId = 1;
  const expectedGuestUsers: GuestUserModel[] =
    [{ id: 1, name: 'A', roomId }, { id: 2, name: 'B', roomId }];

  httpClientSpy.get.and.returnValue(of(expectedGuestUsers));

  guestUserService.findByRoom(roomId).subscribe(
    guestUsers => expect(guestUsers).toEqual(expectedGuestUsers));

  expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
});

it('should return an error when the server returns a 404', () => {
  const errorResponse = new HttpErrorResponse({
    error: 'test 404 error',
    status: 404, statusText: 'Not Found'
  });

  httpClientSpy.get.and.returnValue(throwError(errorResponse));

  guestUserService.findByRoom(1).subscribe(
    _ => fail('expected an error, not guest users'),
    error  => expect(error.error).toContain('test 404 error')
  );
});

it('should return new id', () => {
  const guestUserId = 1;
  const guestUser: GuestUserModel = { name: 'A', roomId: 1 };

  httpClientSpy.post.and.returnValue(of(guestUserId));

  guestUserService.create(guestUser).subscribe(resultId => expect(resultId).toEqual(guestUserId));

  expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
});

it('should return logged user', () => {
  const guestUserId = 1;
  const guestUser: GuestUserModel = { name: 'A', roomId: 1 };

  httpClientSpy.post.and.returnValue(of(guestUserId));
  guestUserService.create(guestUser).subscribe(_ => _);

  expect(guestUserService.loggedGuestUser).toEqual({ id: guestUserId, ...guestUser });
});
