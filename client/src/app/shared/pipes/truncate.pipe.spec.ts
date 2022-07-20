import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let truncatePipe: TruncatePipe;

  beforeEach(() => {
    truncatePipe = new TruncatePipe();
  });

  it('create an instance', () => {
    expect(truncatePipe).toBeTruthy();
  });

  it('truncates a string', () => {
    expect(truncatePipe.transform('1234567890', 5)).toBe('12345...');
  });

  it('truncates a string with complete words', () => {
    expect(truncatePipe.transform('1234567890 hello', 25, true, '')).toBe(
      '1234567890'
    );
  });
});
